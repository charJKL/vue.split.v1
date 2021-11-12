import {cloneDeep, findIndex} from 'lodash';

export const record = 
{
	wasEdited: false,
	errors: [],
	source:
	{
		filename: '',
		url: '',
		size: {width: 0, height: 0},
	},
	metrics:
	{
		x1: { name: 'x1', type: 'line', subtype: 'vertical', value: 50 },
		x2: { name: 'x2', type: 'line', subtype: 'vertical', value: 250 },
		y1: { name: 'y1', type: 'line', subtype: 'horizontal', value: 50 },
		y2: { name: 'y2', type: 'line', subtype: 'horizontal', value: 250 },
		rotate: { name: 'rotate', type: 'float', subtype: 'float', value: 0 },
	}
}

// access this by $this.store.state.<list>
const state = {
	list: [],
	index: null,
}

// access this by $this.store.getters.<list>
const getters = {
	list(state)
	{ 
		return state.list;
	},
	index(state)
	{
		return state.index;
	},
	current(state)
	{
		if(state.list[state.index] === undefined) return null;
		return state.list[state.index];
	},
	source(state, getters)
	{
		return getters.current && getters.current.source;
	},
	metrics(state, getters)
	{
		return getters.current && getters.current.metrics;
	}
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const loadList = 'load-list-action';
export const loadSave = 'load-save-action';
export const loadDefault = 'load-default-action';
export const selectCurrent = 'select-current-action';
export const selectIndex = 'select-index-action';
export const updateMetrics = 'update-metrics-action';

const actions = 
{
	[loadList]({commit}, files)
	{
		let list = [];
		for(let file of files)
		{
			let instance = cloneDeep(record);
				instance.source.filename = file.name;
				instance.source.url = URL.createObjectURL(file);
			const image = new Image();
				image.addEventListener('load', e => instance.source.size = { width: e.target.naturalWidth, height: e.target.naturalHeight });
				image.addEventListener('error', () => instance.errors.push("Cant read natural image size.") );
				image.src = instance.source.url;
			list.push(instance);
		}
		commit('list', list);
		commit('index', null);
	},
	[loadSave]({commit}, filepath)
	{
		console.log('loadSave', filepath, commit);
	},
	[loadDefault]({state, commit}, blueprint)
	{
		for (const [index, record] of state.list.entries())
		{
			if(record.wasEdited === true) continue;
			if(record.source.filename.match(blueprint.source.filename) === null) continue;
			commit('record', {index: index, field: 'metrics', value: blueprint.metrics});
		}
	},
	[selectIndex]({commit}, index)
	{
		commit('index', index);
	},
	[selectCurrent]({getters, dispatch}, filename)
	{
		let find = findIndex(getters.list, (o) => o.source.filename === filename);
		if(find === -1) find = null;
		dispatch(selectIndex, find);
	},
	[updateMetrics]({getters, commit}, metrics)
	{
		commit('record', {index: getters.index, field: 'wasEdited', value: true});
		commit('record', {index: getters.index, field: 'metrics', value: metrics});
	},
}

// access this by $this.store.commit(<setList>, value)
const mutations = 
{
	list(state, list){ state.list = list; },
	index(state, index){ state.index = index; },
	record(state, record){ state.list[record.index][record.field] = record.value },
}

export default { state, getters, actions, mutations };