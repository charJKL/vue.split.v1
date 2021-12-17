import Status from '../lib/Status';
import {getRandomHash} from '../lib/getRandomHash';
import {cloneDeep} from 'lodash';

export const record = 
{
	id: '',
	source:
	{
		status: Status.Dirty,
		blob: null,
		filename: '',
		url: '',
		img: null,
		width: 0,
		height: 0,
		errors: {},
	},
	metrics:
	{
		wasEdited: false,
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0,
		rotate: 0,
	},
	cropped:
	{
		status: Status.Dirty,
		details: '',
		blob: null,
		width: 0,
		height: 0,
	},
	ocr: 
	{
		status: Status.Dirty,
		wasParsed: false,
		details: '',
		text: '',
		words: [],
		lines: [],
	},
	features:
	{
		changes: [],
	},
}

export const line = {
	baseline: null,
	bbox: null,
	text: "",
};
export const change = 
{
	apply: false,
	header: false,
	paragraph: false,
	quote: false,
	image: false,
	text: ""
};

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
	},
	ocr(state)
	{
		return state.records.get(state.selected)?.ocr ?? null;
	},
	features(state)
	{
		return state.records.get(state.selected)?.features ?? null;
	}
}

// access this by this.$store.dispatch('load-file', value)
// in actions i should call commits()
export const loadPdfFile = 'load-pdf-file-action';
export const getResults = 'get-results-action';
export const loadImagesFiles = 'load-images-files-action';
export const updateSource = 'update-source-action';
export const updateMetrics = 'update-metrics-action';
export const updateCropped = 'update-cropped-action';
export const updateFeatures = 'update-features-action';
export const selectRecord = 'select-record-action';
export const applyBlueprint = 'apply-blueprint-action';
const actions = 
{
	[loadImagesFiles]({state, commit}, files)
	{
		for(const file of files)
		{
			const vrecord = cloneDeep(record);
			do{ vrecord.id = getRandomHash(16); } while (state.records.has(vrecord.id)); // makre sure that id is unique
			commit('record', vrecord);
			
			const vsource = {...vrecord.source};
			vsource.filename = file.name;
			vsource.blob = file;
			commit('source', {id: vrecord.id, value: vsource});
		}
	},
	[getResults]({getters})
	{
		return new Promise((resolve) => {
			var text = '';
			for(const record of getters.records)
			{
				for(let i=0; i < record.ocr.lines.length; i++)
				{
					const ocr = record.ocr.lines[i];
					const change = record.features.changes?.[i] ?? null;
					const line = change?.apply == true ? change.text : ocr.text;
					text += line.trimEnd() + '\n';
				}
			}
			resolve(text);
		});
	},
	[updateSource]({state, commit}, source)
	{
		if(state.selected === null) return;
		if(source.status < Status.Completed) throw new Error(`You can't change source status.`, state.records.get(state.selected));
		commit('source', {id: state.selected, value: source});
	},
	[updateMetrics]({state, commit}, metrics)
	{
		if(state.selected === null) return;
		metrics.wasEdited = true;
		commit('metrics', {id: state.selected, value: metrics});
	},
	[updateFeatures]({state, commit}, features)
	{
		if(state.selected === null) return;
		commit('features', {id: state.selected, value: features});
	},
	[selectRecord]({commit}, record)
	{
		commit('selected', record?.id ?? null);
	}
}

// access this by this.$store.commit('record', value)
const mutations = 
{
	record(state, record){ state.records.set(record.id, record); },
	source(state, {id, value}){ state.records.get(id).source = value; },
	metrics(state, {id, value}){ state.records.get(id).metrics = value; },
	cropped(state, {id, value}){ state.records.get(id).cropped = value; },
	ocr(state, {id, value}){ state.records.get(id).ocr = value; },
	features(state, {id, value}){ state.records.get(id).features = value; },
	selected(state, id){ state.selected = id; }
}

export default { state, getters, actions, mutations };