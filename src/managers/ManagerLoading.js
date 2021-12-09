import {Status} from '../lib/Status';

function ManagerLoading(store)
{
	store.subscribe(filterMutations);
	
	function filterMutations(mutation, state)
	{
		if(mutation.type == 'source')
		{
			sourceChanged(store, state, mutation);
			return;
		}
	}
	
	function sourceChanged(store, state, mutation)
	{
		const id = mutation.payload.id;
		const source = state.records.records.get(id).source;
		if(source.status > Status.Dirty) return;
		loadImage(store, state, id);
	}
	
	function loadImage(store, state, id)
	{
		const source = {...state.records.records.get(id).source};
		source.url = URL.createObjectURL(source.blob);
		source.img = new Image();
		source.img.addEventListener('load', onImageLoad.bind(source.img, store, state, id));
		source.img.addEventListener('error', onImageError.bind(source.img, store, state, id));
		source.status = Status.Loading;
		store.commit('source', {id: id, value: source});

		source.img.src = source.url;
		function onImageLoad(store, state, id, e)
		{
			const source = {...state.records.records.get(id).source};
			const metrics = {...state.records.records.get(id).metrics};
			source.status = Status.Completed;
			source.width = e.target.naturalWidth;
			source.height = e.target.naturalHeight;
			metrics.x1 = source.width * 0.1;
			metrics.x2 = source.width - metrics.x1;
			metrics.y1 = source.height * 0.1;
			metrics.y2 = source.height - metrics.y1;
			store.commit('source', {id: id, value: source});
			store.commit('metrics', {id: id, value: metrics});
		}
		function onImageError(store, state, id)
		{
			const source = {...state.records.records.get(id).source};
			source.status = Status.Error;
			source.errors.loading = 'Cant load image';
			store.commit('source', {id: id, value: source});
		}
	}
}

export default ManagerLoading;