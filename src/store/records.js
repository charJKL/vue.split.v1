import {getDeepCopy} from '../lib/getDeepCopy';
import {getRandomHash} from '../lib/getRandomHash';

export const Loading = { Idle: 'Idle', Waiting: 'Waiting', Done: 'Done' };

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
		img: null,
	}
}

// access this by this.$store.state.<list>
const state = {
	records: new Map(),
	record: null,
}

// access this by this.$store.getters.<list>
const getters = {
	records(state)
	{
		return Array.from(state.records, element => element[1]);
	},
	source(state)
	{
		return state.records.get(state.record)?.source ?? null;
	},
	metrics(state)
	{
		return state.records.get(state.record)?.metrics ?? null;
	},
	cropped(state)
	{
		return state.records.get(state.record)?.cropped ?? null;
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
			const instance = getDeepCopy(record);
			while(instance.id === '' || state.records.has(instance.id)) instance.id = getRandomHash(16);
			state.records.set(instance.id, instance);
			
			const source = getDeepCopy(record.source);
					source.filename = file.name;
					source.url = URL.createObjectURL(file);
			commit('source', {id: instance.id, value: source});
			dispatch('loadImage', instance);
		}
		commit('records', new Map(state.records));
	},
	[updateSource]({state, commit, dispatch}, source)
	{
		if(state.record === null) return;
		const record = state.records.get(state.record);
		const value = state.records.get(state.record).source;
		commit('source', {id: record.id, value: getDeepCopy(source)});

		if(value.url.href !== source.url.href) dispatch('loadImage', record);
	},
	[updateMetrics]({commit}, metrics)
	{
		commit('metrics', metrics);
	},
	[selectRecord]({commit}, record)
	{
		commit('record', record?.id ?? null);
	},
	loadImage({commit}, record)
	{
		record.source.loading = Loading.Idle;
		record.source.img = new Image();
		record.source.img.addEventListener('load', onImageLoad);
		record.source.img.addEventListener('error', onImageError);
		record.source.img.src = record.source.url;
		
		function onImageLoad(e)
		{
			const source = getDeepCopy(record.source);
					//source.loading = Loading.Done;
					source.width = e.target.naturalWidth;
					source.height = e.target.naturalHeight;
			commit('source', {id: record.id, value: source});
		}
		function onImageError()
		{
			const source = getDeepCopy(record.source);
					source.loading = Loading.Idle;
					source.errors.loading = 'Cant load image';
			commit('source', {id: record.id, value: source});
		}
	}
}

// access this by this.$store.commit('record', value)
const mutations = 
{
	records(state, records){ state.records = records; },
	source(state, {id, value}){ state.records.get(id).source = value; },
	metrics(state, {id, value}){ state.records.get(id).metrics = value; },
	record(state, id){ state.record = id; }
}

export default { state, getters, actions, mutations };