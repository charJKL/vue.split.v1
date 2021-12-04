import {Status} from '../lib/Status';
import List from '../lib/List';
import ParseJob from './ocr/ParseJob';

function ManagerOcr(store)
{
	var list = new List();
	var refs = new Map();
	var maxWorkers = 1;

	store.subscribe(filterMutations);
	
	function filterMutations(mutation, state)
	{
		if(mutation.type == 'selected' && mutation.payload !== null)
		{
			selectedChanged(store, state, mutation);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Dirty)
		{
			croppedChangedToDirty(store, state, mutation);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Completed)
		{
			croppedChangedToDone(store, state, mutation);
			return;
		}
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
		forceParse(store, state, id);
	}
	
	function croppedChangedToDirty(store, state, mutation)
	{
		const id = mutation.payload.id;
		const ocr = state.records.records.get(id).ocr;
		
		// Cropped values changes hence current result are dirty, not valid anymore:
		ocr.status = Status.Dirty;
		store.commit('ocr', {id: id, value: {...ocr}});
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
		const job = prepareJob(store, state, id);
		refs.get(id)?.terminate('Result is obsolete');
		refs.set(id, job);
		list.push(job);
		scheduleLoop();
	}
	
	function forceParse(store, state, id)
	{
		const job = prepareJob(store, state, id)
		refs.get(id)?.terminate('Result is obsolete');
		refs.set(id, job);
		list.enqueue(job);
		job.run();
	}
	
	function prepareJob(store, state, id)
	{
		const blob = state.records.records.get(id).cropped.blob;
		const job = new ParseJob(blob);
				job.addEventListener('initialization', notifyOcrAboutProgress);
				job.addEventListener('recognize', notifyOcrAboutProgress);
				job.addEventListener('interrupted', notifyOcrAboutError);
				job.addEventListener('done', notifyOcrAboutData);
				job.addEventListener('ended', () => refs.delete(job));
				job.addEventListener('ended', scheduleLoop);
		return job;
		
		function notifyOcrAboutProgress(log)
		{
			const ocr = state.records.records.get(id).ocr;
					ocr.status = Status.Working;
					ocr.details = log.toString();
			store.commit('ocr', {id: id, value: {...ocr}});
		}
		function notifyOcrAboutError(log)
		{
			const ocr = state.records.records.get(id).ocr;
					ocr.status = Status.Error;
					ocr.details = log;
			store.commit('ocr', {id: id, value: {...ocr}});
		}
		function notifyOcrAboutData(data)
		{
			const ocr = state.records.records.get(id).ocr;
					ocr.status = Status.Completed;
					ocr.lines = [...data.lines];
			store.commit('ocr', {id: id, value: {...ocr}});
		}
	}
	
	function scheduleLoop()
	{
		console.log(list.toArray(), list);
		var active = 0;
		for(const job of list)
		{
			if(active >= maxWorkers) return;
			if(job.isEnded() === true)
			{
				console.log('list.delete', job.id, job);
				list.delete(job);
				continue;
			}
			if(job.isActive() === true)
			{
				active++;
				continue;
			}
			if(job.isIdle() === true)
			{
				console.log('job.run', job);
				job.run();
			}
		}
	}
}

export default ManagerOcr;