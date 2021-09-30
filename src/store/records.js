import Record from '../components/Record';
import {cloneDeep, findIndex} from 'lodash';

// access this by $this.store.state.<list>
const state = {
	list: [],
	index: null,
}

// access this by $this.store.getters.<getList>
const getters = {
	getList(state)
	{ 
		return state.list; 
	},
	getIndex(state)
	{
		return state.index;
	},
	getCurrent(state)
	{
		if(state.list[state.index] === undefined) return null;
		return state.list[state.index];
	},
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const loadFile = 'load-file-action';
export const loadSave = 'load-save-action';
export const changeCurrent = 'change-current-action';
export const selectIndex = 'select-index-action';
export const updateMetrics = 'update-metrics-action';
export const applyBlueprint = 'apply-blueprint-action';
const readImageSize = 'read-image-size';
const actions = 
{
	[loadFile]({commit, dispatch}, files)
	{
		let list = [];
		for(let file of files)
		{
			let record = cloneDeep(Record);
				record.source.filename = file.name;
				record.source.url = URL.createObjectURL(file);
			list.push(record);
			dispatch(readImageSize, record);
		}
		commit('index', null);
		commit('list', list);
	},
	[loadSave]({commit}, filepath)
	{
		console.log('loadSave', filepath, commit);
	},
	[changeCurrent]({getters, dispatch}, filename)
	{
		let find = findIndex(getters.getList, (o) => o.source.filename === filename);
		if(find === -1) find = null;
		dispatch(selectIndex, find);
	},
	[selectIndex]({getters, commit}, index)
	{
		if(getters.getCurrent !== null) getters.getCurrent.isSelected = false;
		commit('index', index);
		if(getters.getCurrent !== null) getters.getCurrent.isSelected = true;
	},
	[applyBlueprint]({state, commit}, blueprint)
	{
		for (const [index, record] of state.list.entries())
		{
			if(record.wasEdited === true) continue;
			if(record.source.filename.match(blueprint.source.filename) === null) continue;
			commit('record', {index: index, field: 'metrics', value: blueprint.metrics});
		}
	},
	[updateMetrics]({getters, commit}, metrics)
	{
		commit('record', {index: getters.getIndex, field: 'metrics', value: metrics});
		commit('record', {index: getters.getIndex, field: 'wasEdited', value: true});
	},
	[readImageSize](state, record)
	{
		const image = new Image();
		image.addEventListener('load', e => record.source.size = { width: e.target.naturalWidth, height: e.target.naturalHeight });
		image.addEventListener('error', () => record.errors.push("Cant read natural image size.") );
		image.src = record.source.url;
	}
}

// access this by $this.store.commit(<setList>, value)
const mutations = 
{
	list(state, list){ state.list = list; },
	index(state, index){ state.index = index; },
	record(state, record){ state.list[record.index][record.field] = record.value },
}

export default { state, getters, actions, mutations };