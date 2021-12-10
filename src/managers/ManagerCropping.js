import {Status} from '../lib/Status';
import {debounce} from 'lodash';

function ManagerCropping(store)
{
	store.subscribe(filterMutations);
	
	const throttle = 200;
	const doCropImageWork = debounce(cropImage, throttle, {leading: false, trailing: true});
	
	function filterMutations(mutation, state)
	{
		if(mutation.type == 'selected')
		{
			const id = mutation.payload;
			const record = state.records.records.get(id);
			selectedChanged(store, id, record);
			return;
		}
		if(mutation.type == 'source')
		{
			const id = mutation.payload.id;
			const record = state.records.records.get(id);
			sourceChanged(store, id, record);
		}
		if(mutation.type == 'metrics')
		{
			const id = mutation.payload.id;
			const record = state.records.records.get(id);
			metricsChanged(store, id, record);
			return;
		}
	}
	
	function selectedChanged(store, id, {source, metrics, cropped})
	{
		if(isThereStallOnDependetRecord(id, source, metrics, cropped) === true) return;
		if(isAcuallyUnselect(id) === true) return;
		if(isAlreadyWorkInProgressOnThis(cropped) === true) return;
		
		const vcropped = {...cropped};
		vcropped.status = Status.Waiting;
		vcropped.details = String(Date.now() + throttle);
		store.commit('cropped', {id: id, value: vcropped});
		doCropImageWork(store, id, source, metrics, cropped);
	}
	
	function sourceChanged(store, id, {source, metrics, cropped})
	{
		if(isThereStallOnDependetRecord(id, source, metrics, cropped) === true) return;
		if(isAlreadyWorkInProgressOnThis(cropped) === true) return;
		
		const vcropped = {...cropped};
		vcropped.status = Status.Waiting;
		vcropped.details = String(Date.now() + throttle);
		store.commit('cropped', {id: id, value: vcropped});
		doCropImageWork(store, id, source, metrics, cropped);
	}
	
	function metricsChanged(store, id, {source, metrics, cropped})
	{
		if(isThereStallOnDependetRecord(id, source, metrics, cropped) === true) return;
		
		const vcropped = {...cropped};
		vcropped.status = Status.Waiting;
		vcropped.details = String(Date.now() + throttle);
		store.commit('cropped', {id: id, value: vcropped});
		doCropImageWork(store, id, source, metrics, cropped);
	}
	
	function isThereStallOnDependetRecord(id, source, metrics, cropped)
	{
		if(isSourceNotLoadedYet(source) === true)
		{
			const vcropped = {...cropped};
			vcropped.status = Status.Stall;
			vcropped.details = 'Waiting on source to load.';
			store.commit('cropped', {id: id, value: vcropped});
			return;
		}
		if(isMetricsNotEdited(metrics) === true)
		{
			const vcropped = {...cropped};
			vcropped.status = Status.Stall;
			vcropped.details = 'Waiting on changes on metrics.';
			store.commit('cropped', {id: id, value: vcropped});
			return;
		}
	}
	function isSourceNotLoadedYet(source){ return source.status != Status.Completed; }
	function isMetricsNotEdited(metrics){ return metrics.wasEdited === false; }
	function isAcuallyUnselect(id){ return id == null; }
	function isAlreadyWorkInProgressOnThis(cropped){ return cropped.status > Status.Stall; }
	
	function cropImage(store, id, source, metrics, cropped)
	{
		const vcropped = {...cropped};
		vcropped.status = Status.Working;
		store.commit('cropped', {id: id, value: vcropped});
		
		const rotated = drawRotated(source, metrics);
		const clip = drawClip(rotated, metrics);
		clip.convertToBlob({type: "image/png"}).then(function(blob){
			const vcropped = {...cropped}
			vcropped.status = Status.Completed;
			vcropped.width = clip.width;
			vcropped.height = clip.height;
			vcropped.blob = blob;
			store.commit('cropped', {id: id, value: vcropped});
		});
	}
	
	function drawRotated(source, metrics)
	{
		const canvas = new OffscreenCanvas(source.width, source.height);
		const context = canvas.getContext("2d", {alpha: false});
		
		const halfX = source.width / 2;
		const halfY = source.height / 2;
			
		context.translate(halfX, halfY);
		context.rotate(metrics.rotate * Math.PI / 180);
		context.translate(halfX * -1, halfY * -1);
		context.drawImage(source.img, 0, 0);
		return canvas;
	}
	function drawClip(rotated, metrics)
	{
		const width = metrics.x2 - metrics.x1;
		const height = metrics.y2 - metrics.y1;
		
		const canvas = new OffscreenCanvas(width, height);
		const context = canvas.getContext("2d", {alpha: false});
		context.drawImage(rotated, metrics.x1, metrics.y1, width, height, 0, 0, width, height);
		return canvas;
	}
}

export default ManagerCropping;