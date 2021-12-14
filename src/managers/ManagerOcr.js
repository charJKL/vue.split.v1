import {Status} from '../lib/Status';
import List from '../lib/List';
import ParseJob from './ocr/ParseJob';

function ManagerOcr(store)
{
	store.subscribe(filterMutations);
	
	const list = new List();
	const refs = new Map();
	const maxWorkers = 1;

	function filterMutations(mutation, state)
	{
		if(mutation.type == 'selected')
		{
			const id = mutation.payload;
			const record = state.records.records.get(id);
			selectedChanged(store, id, record);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Dirty)
		{
			const id = mutation.payload.id;
			const record = state.records.records.get(id);
			croppedChangedToDirty(store, id, record);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Completed)
		{
			const id = mutation.payload.id;
			const record = state.records.records.get(id);
			croppedChangedToDone(store, id, record);
			return;
		}
	}
	
	function selectedChanged(store, id, {cropped, ocr})
	{
		if(isThereStallOnDependedRecord(id, cropped, ocr) === true) return;
		if(isAcuallyUnselect(id) === true) return;
		if(isAlreadyWorkInProgressOnThis(ocr) === true) return;
		forceParse(store, id, cropped, ocr);
	}
	
	function croppedChangedToDirty(store, id, {ocr})
	{
		const vocr = {...ocr}; // cropped values changes, hence current ocr result are dirty: not valid anymore.
		vocr.status = Status.Dirty;
		store.commit('ocr', {id: id, value: vocr});
	}
	
	function croppedChangedToDone(store, id, {cropped, ocr})
	{
		if(isThereStallOnDependedRecord(id, cropped, ocr) === true) return;
		scheduleParse(store, id, cropped, ocr);
	}
	
	function isThereStallOnDependedRecord(id, cropped, ocr)
	{
		if(isCroppedDataNotReadyYet(cropped) === true)
		{
			const vocr = {...ocr};
			vocr.status = Status.Stall;
			vocr.details = 'cropped';
			store.commit('ocr', {id: id, value: vocr});
			return true;
		}
		return false;
	}
	
	function isCroppedDataNotReadyYet(cropped){ return cropped.status !== Status.Completed; }
	function isAcuallyUnselect(id){ return id == null; }
	function isAlreadyWorkInProgressOnThis(ocr){ return ocr.status > Status.Stall; }
	
	function scheduleParse(store, id, cropped, ocr) // schedule parse for later
	{ 
		const job = prepareJob(store, id, cropped, ocr);
		refs.get(id)?.terminate('Result is obsolete');
		refs.set(id, job);
		list.push(job);
		const vocr = {...ocr};
		vocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: vocr});
		
		scheduleLoop();
	}
	
	function forceParse(store, id, cropped, ocr) // start job right now
	{
		const job = prepareJob(store, id, cropped, ocr)
		refs.get(id)?.terminate('Result is obsolete');
		refs.set(id, job);
		list.enqueue(job);
		const vocr = {...ocr};
		vocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: vocr});
		
		job.run();
	}
	
	function prepareJob(store, id, cropped, ocr)
	{
		const job = new ParseJob(cropped.blob);
				job.addEventListener('initialization', notifyOcrAboutLoading.bind(job, store, id, ocr));
				job.addEventListener('recognize', notifyOcrAboutProgress.bind(job, store, id, ocr));
				job.addEventListener('interrupted', notifyOcrAboutError.bind(job, store, id, ocr));
				job.addEventListener('done', notifyOcrAboutData.bind(job, store, id, ocr));
				job.addEventListener('ended', () => refs.delete(job));
				job.addEventListener('ended', scheduleLoop);
		return job;
		
		function notifyOcrAboutLoading(store, id, ocr, log)
		{
			const vocr = {...ocr};
			vocr.status = Status.Loading;
			vocr.details = log;
			store.commit('ocr', {id: id, value: vocr});
		}
		function notifyOcrAboutProgress(store, id, ocr, log)
		{
			const vocr = {...ocr};
			vocr.status = Status.Working;
			vocr.details = (log * 100).toFixed(0);
			store.commit('ocr', {id: id, value: vocr});
		}
		function notifyOcrAboutError(store, id, ocr, log)
		{
			const vocr = {...ocr};
			vocr.status = Status.Error;
			vocr.details = log;
			store.commit('ocr', {id: id, value: vocr});
		}
		function notifyOcrAboutData(store, id, ocr, data)
		{
			const vocr = {...ocr};
			vocr.status = Status.Completed;
			vocr.wasParsed = true;
			vocr.text = data.text;
			vocr.lines = data.lines.map(line => {return {bbox: line.bbox, baseline: line.baseline, text: line.text}});
			vocr.words = data.words.map(word => {return {bbox: word.bbox, baseline: word.baseline, text: word.text, choices: word.choices}});
			store.commit('ocr', {id: id, value: vocr});
		}
	}
	
	function scheduleLoop()
	{
		var active = 0;
		for(const job of list)
		{
			if(active >= maxWorkers) return;
			if(job.isEnded() === true)
			{
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