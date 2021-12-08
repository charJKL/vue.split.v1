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
		
		const instance = {...state.records.records.get(id).ocr};
				instance.status = Status.Queued;
		store.commit('ocr', {id: id, value: instance});
		forceParse(store, state, id);
	}
	
	function croppedChangedToDirty(store, state, mutation)
	{
		const id = mutation.payload.id;

		// Cropped values changes hence current result are dirty, not valid anymore:
		const instance = {...state.records.records.get(id).ocr};
				instance.status = Status.Dirty;
		store.commit('ocr', {id: id, value: instance});
	}

	function croppedChangedToDone(store, state, mutation)
	{
		const id = mutation.payload.id;
		
		const instance = {...state.records.records.get(id).ocr};
				instance.status = Status.Queued;
		store.commit('ocr', {id: id, value: instance});
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
		const ocr = state.records.records.get(id).ocr;
		const job = new ParseJob(blob);
				job.addEventListener('initialization', notifyOcrAboutLoading.bind(job, store, id, ocr));
				job.addEventListener('recognize', notifyOcrAboutProgress.bind(job, store, id, ocr));
				job.addEventListener('interrupted', notifyOcrAboutError.bind(job, store, id, ocr));
				job.addEventListener('done', notifyOcrAboutData.bind(job, store, id, ocr));
				job.addEventListener('ended', () => refs.delete(job));
				job.addEventListener('ended', scheduleLoop);
		return job;
		
		function notifyOcrAboutLoading(store, id, ocr, log)
		{
			const instance = {...ocr};
					instance.status = Status.Loading;
					instance.details = log;
			store.commit('ocr', {id: id, value: instance});
		}
		function notifyOcrAboutProgress(store, id, ocr, log)
		{
			const instance = {...ocr};
					instance.status = Status.Working;
					instance.details = (log * 100).toFixed(0);
			store.commit('ocr', {id: id, value: instance});
		}
		function notifyOcrAboutError(store, id, ocr, log)
		{
			const instance = {...ocr};
					instance.status = Status.Error;
					instance.details = log;
			store.commit('ocr', {id: id, value: instance});
		}
		function notifyOcrAboutData(store, id, ocr, data)
		{
			console.log('daa', data);
			const instance = {...ocr};
					instance.status = Status.Completed;
					instance.wasParsed = true;
					instance.text = data.text;
					instance.lines = data.lines.map(line => {return {bbox: line.bbox, baseline: line.baseline, text: line.text}});
					instance.words = data.words.map(word => {return {bbox: word.bbox, baseline: word.baseline, text: word.text, choices: word.choices}});
			store.commit('ocr', {id: id, value: instance});
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