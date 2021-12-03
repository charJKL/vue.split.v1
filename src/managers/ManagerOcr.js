import {Status} from '../lib/Status';
import {createWorker} from 'tesseract.js';
/* eslint-disable */

function IndexedQueue()
{
	this.list = new Map();
	this.order = [];
}

IndexedQueue.prototype[Symbol.iterator] = function*() 
{
	let index = 0;
	return {
		next: () => {
			const job = this.list.get(this.order[index]);
			if(job.active === false)
			
			if(index < context.order.length) return {value: context.list.get(context.order[index++]), done: false};
			return {done: true};
		},
	}
};

IndexedQueue.prototype.enqueue = function(key, object) 
{
	this.list.set(key, object);
	this.order.push(key);
};

IndexedQueue.prototype.dequeue = function () 
{
	const key = this.order.shift();
	const object = this.list.get(key);
	this.list.delete(key);
	return object;
};

IndexedQueue.prototype.peek = function()
{
	const key = this.order.peek();
	const object = this.list.get(key);
	return object;
}

IndexedQueue.prototype.has = function (key)
{
	return this.list.has(key);
}

IndexedQueue.prototype.get = function(key)
{
	return this.list.has(key) ? this.list.get(key) : null;
}

IndexedQueue.prototype.delete = function(key)
{
	this.list.delete(key);
	this.order.splice(this.order.findIndex(key), 1);
}

IndexedQueue.prototype.length = function()
{
	return this.order.length;
}

IndexedQueue.prototype.isEmpty = function()
{
	return this.order.length === 0;
}

var queue = new IndexedQueue();
var isWorking = false;

function ManagerOcr(store)
{
	store.subscribe(filterMutations);
	
	function filterMutations(mutation, state)
	{
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Dirty)
		{
			croppedChangedToDirty(store, state, mutation);
			return;
		}
		if(mutation.type == 'selected' && mutation.payload !== null)
		{
			selectedChanged(store, state, mutation);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Completed)
		{
			croppedChangedToDone(store, state, mutation);
			return;
		}
	}
	
	function croppedChangedToDirty(store, state, mutation)
	{
		const id = mutation.payload.id;
		const ocr = state.records.records.get(id).ocr;
		
		// Cropped values changes hence current result are dirty, not valid anymore:
		ocr.status = Status.Dirty;
		store.commit('ocr', {id: id, value: {...ocr}});
	}
	
	function selectedChanged(store, state, mutation)
	{
		const id = mutation.payload;
		const cropped = state.records.records.get(id).cropped;
		const ocr = state.records.records.get(id).ocr;
		if(cropped.status !== Status.Completed) return; // cropped data is not ready yet.
		if(ocr.status > Status.Dirty) return; // cord data is already done or in process.
		
		ocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: {...ocr}});
		scheduleParse(store, state, id);
	}
	
	function croppedChangedToDone(store, state, mutation)
	{
		const id = mutation.payload.id;
		const ocr = state.records.records.get(id).ocr;
		
		ocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: {...ocr}});
		scheduleParse(store, state, id);
	}
	
	function scheduleParse(store, state, id)
	{
		queue.enqueue(id, new ParseJob(store, state, id));
		scheduleLoop();
	}
	
	function forceParse(store, state, id)
	{
		queue.enqueue(id, new ParseJob(store, state, id));
		queue.get(id).run().then(scheduleLoop());
	}
	
	function scheduleLoop()
	{
		const active = 0;
		const maxWorkers = 1;
		for(const job of queue)
		{
			if(active >= maxWorkers) return;
			if(job.isTerminated() === true)
			{
				queue.delete(job);
				continue;
			}
			if(job.isActive() === true)
			{
				active++;
				continue;
			}
			job.run().then(scheduleLoop());
		}
	}
}

function ParseJob(store, state, id)
{
	this.store = store;
	this.state = state;
	this.id = id;
	this.worker = null;
	this.active = false;
	this.isTerminated = false;
}
ParseJob.prototype.parameters = {
	user_defined_dpi: '96',
	tessjs_create_hocr: '0',
	tessjs_create_tsv: '0',
	tessjs_create_box: '0',
	tessjs_create_unlv: '0',
	tessjs_create_osd: '0'
};
ParseJob.prototype.run = async function()
{
	const cropped = this.state.records.records.get(this.id).cropped;
	const ocr = this.state.records.records.get(this.id).ocr;
	
	// Update ocr stage status:
	ocr.status = Status.Working;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
	
	// Create web worker:
	this.active = true;
	this.worker = createWorker({
		workerPath: '/worker.min.js',
		langPath: '/',
		corePath: '/tesseract-core.wasm.js',
		logger: this.log,
		errorHandler: this.terminate,
	});
	
	// Prepare tesseract web worker:
	await this.worker.load();
	await this.worker.loadLanguage('eng+pol');
	await this.worker.initialize('pol');
	await this.worker.setParameters(this.parameters);
	
	// Execute tesseract recognition:
	cropped.blob.name = 'some fake name'; // there is a bug in tesseract which require that blob should have name property.
	const result = await this.worker.recognize(cropped.blob);
	
	// Update ocr stage status and save results:
	ocr.status = Status.Completed;
	ocr.lines = [...result.data.lines];
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
	
	// Remove worker:
	this.active = false;
	await this.worker.terminate();
	return Promise.resolve(true);
}
ParseJob.prototype.log = function(e)
{
	console.log(e);
	const ocr = this.state.records.records.get(this.id).ocr;
	ocr.status = Status.Working;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
}
ParseJob.prototype.terminate = function()
{
	this.active = false;
	this.worker.terminate();
	
	const ocr = this.state.records.records.get(this.id).ocr;
	ocr.status = Status.Dirty;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
}

export default ManagerOcr;