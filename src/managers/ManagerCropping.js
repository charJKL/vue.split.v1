import {Status} from '../store/records';

function ManagerCropping(store)
{
	store.subscribe(function(mutation, state){
		if(mutation.type !== 'metrics') return;
		const id = mutation.payload.id;
		const cropped = state.records.records.get(id).cropped;
		
		if(cropped.status === Status.Working) return;
		const source = state.records.records.get(id).source;
		const metrics = state.records.records.get(id).metrics;
		cropped.status = Status.Working;
		store.commit('cropped', {id: id, value: {...cropped}});
		
		const rotated = drawRotated(source, metrics);
		const clip = drawClip(rotated, metrics);
		clip.convertToBlob({type: "image/png"}).then(function(blob){
			cropped.status = Status.Done;
			cropped.width = clip.width;
			cropped.height = clip.height;
			cropped.blob = blob;
			store.commit('cropped', {id: id, value: {...cropped}});
		});
	});
	
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