import {getRandomHash} from '../lib/getRandomHash';

export const Loading = { Idle: 'Idle', Waiting: 'Waiting', Done: 'Done' };
export const Status = { Dirty: 'Dirty', Waiting: 'Waiting', Queued: `Queued`, Working: 'Working', Done: 'Done'};
export const record = 
{
	id: '',
	source:
	{
		loading: Loading.Idle,
		filename: '',
		url: '',
		width: 0,
		height: 0,
		img: null,
		errors: {},
	},
	metrics:
	{
		wasEdited: false,
		x1: 50,
		x2: 250,
		y1: 50,
		y2: 250,
		rotate: 0,
	},
	cropped:
	{
		status: Status.Dirty,
		blob: null,
		width: 0,
		height: 0,
	}
}

// access this by this.$store.state.<list>
const state = {
	records: new Map(),
	selected: null
}

// access this by this.$store.getters.<list>
const getters = {
	records(state)
	{
		return Array.from(state.records, element => element[1]);
	},
	record(state)
	{
		return state.records.get(state.selected) ?? null;
	},
	source(state)
	{
		return state.records.get(state.selected)?.source ?? null;
	},
	metrics(state)
	{
		return state.records.get(state.selected)?.metrics ?? null;
	},
	cropped(state)
	{
		return state.records.get(state.selected)?.cropped ?? null;
	}
}

// access this by this.$store.dispatch('load-file', value)
// in actions i should call commits()
export const loadPdfFile = 'load-pdf-file-action';
export const loadImagesFiles = 'load-images-files-action';
export const updateSource = 'update-source-action';
export const updateMetrics = 'update-metrics-action';
export const updateCropped = 'update-cropped-action';
export const selectRecord = 'select-record-action';
export const applyBlueprint = 'apply-blueprint-action';
const actions = 
{
	[loadImagesFiles]({state, commit, dispatch}, files)
	{
		for(const file of files)
		{
			const instance = {...record};
			while(instance.id === '' || state.records.has(instance.id)) instance.id = getRandomHash(16);
			state.records.set(instance.id, instance);
			
			const source = {...record.source};
					source.filename = file.name;
					source.url = URL.createObjectURL(file);
			commit('source', {id: instance.id, value: source});
			dispatch('loadImage', {id: instance.id, source: source});
		}
		commit('records', new Map(state.records));
	},
	[updateSource]({state, commit, dispatch}, source)
	{
		if(state.selected === null) return;
		const previous = state.records.get(state.selected).source;
		const wasUrlChanged = previous.url.href !== source.url.href;
		
		commit('source', {id: state.selected, value: {...source}});
		if(wasUrlChanged == true) dispatch('loadImage', {id: state.selected, source: source});
	},
	[updateMetrics]({getters, commit, dispatch}, metrics)
	{
		if(state.selected === null) return;
		commit('metrics', {id: state.selected, value: {...metrics}});
		
		const isCurrentlyWorking = getters.cropped.status === Status.Working;
		if(isCurrentlyWorking === false) dispatch('cropImage', {id: state.selected, source: getters.source, metrics: metrics, cropped: getters.cropped});
	},
	[selectRecord]({commit}, record)
	{
		commit('selected', record?.id ?? null);
	},
	loadImage({commit}, {id, source})
	{
		source.loading = Loading.Waiting;
		commit('source', {id: id, value: {...source}});
		
		source.img = new Image();
		source.img.addEventListener('load', onImageLoad);
		source.img.addEventListener('error', onImageError);
		source.img.src = source.url;
		function onImageLoad(e)
		{
			source.loading = Loading.Done;
			source.width = e.target.naturalWidth;
			source.height = e.target.naturalHeight;
			commit('source', {id: id, value: {...source}});
		}
		function onImageError()
		{
			source.loading = Loading.Idle;
			source.errors.loading = 'Cant load image';
			commit('source', {id: id, value: {...source}});
		}
	},
	cropImage({commit}, {id, source, metrics, cropped})
	{
		cropped.status = Status.Working;
		commit('cropped', {id: id, value: {...cropped}});
		
		const rotated = drawRotated(source, metrics);
		const clip = drawClip(rotated, metrics);
		clip.convertToBlob({type: "image/png"}).then(function(blob){
			cropped.status = Status.Done;
			cropped.width = clip.width;
			cropped.height = clip.height;
			cropped.blob = blob;
			commit('cropped', {id: id, value: {...cropped}});
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
}

// access this by this.$store.commit('record', value)
const mutations = 
{
	records(state, records){ state.records = records; },
	source(state, {id, value}){ state.records.get(id).source = value; },
	metrics(state, {id, value}){ state.records.get(id).metrics = value; },
	cropped(state, {id, value}){ state.records.get(id).cropped = value; },
	selected(state, id){ state.selected = id; }
}

export default { state, getters, actions, mutations };