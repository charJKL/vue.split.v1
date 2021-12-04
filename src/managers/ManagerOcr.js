import {Status} from '../lib/Status';
import SchedulerList from './ocr/SchedulerList';
import ParseJob from './ocr/ParseJob';

function ManagerOcr(store)
{
	var queue = new SchedulerList();
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
		const job = new ParseJob(store, state, id);
		refs.get(id)?.terminate();
		refs.set(id, job);
		queue.push(job);
		scheduleLoop();
	}
	
	function forceParse(store, state, id)
	{
		const job = new ParseJob(store, state, id);
		refs.get(id)?.terminate();
		refs.set(id, job);
		queue.push(job);
		job.run().then(scheduleLoop);
	}
	
	function scheduleLoop()
	{
		console.log(queue.toArray());
		var active = 0;
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
			if(job.isIdle() === true)
			{
				job.run().then(() => {console.log('Job was done'); scheduleLoop();});
			}
		}
	}
}

export default ManagerOcr;