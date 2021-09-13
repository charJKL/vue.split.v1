import Record from '../components/Record';
import {cloneDeep} from 'lodash';

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
export const selectIndex = 'select-index-action';
export const updateMetrics = 'update-metrics-action';
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
		commit('list', list);
	},
	[loadSave]({commit}, value)
	{
		console.log('loadSave', value, commit);
	},
	[selectIndex]({getters, commit}, value)
	{
		if(getters.getCurrent !== null) getters.getCurrent.isSelected = false;
		commit('index', value);
		getters.getCurrent.isSelected = true;
	},
	[updateMetrics]({commit}, value)
	{
		commit('metrics', value);
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
	metrics(state, metrics){ state.list[state.index].metrics = metrics; },
}

export default { state, getters, actions, mutations };