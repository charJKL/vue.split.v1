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
		source.img.addEventListener('load', onImageLoad.bind(source.img, store, id, source));
		source.img.addEventListener('error', onImageError.bind(source.img, store, id, source));
		source.status = Status.Loading;
		store.commit('source', {id: id, value: source});

		source.img.src = source.url;
		function onImageLoad(store, id, source, e)
		{
			const instance = {...source};
					instance.status = Status.Completed;
					instance.width = e.target.naturalWidth;
					instance.height = e.target.naturalHeight;
			store.commit('source', {id: id, value: instance});
		}
		function onImageError(store, id, source)
		{
			const instance = {...source};
					instance.status = Status.Error;
					instance.errors.loading = 'Cant load image';
			store.commit('source', {id: id, value: instance});
		}
	}
}

export default ManagerLoading;