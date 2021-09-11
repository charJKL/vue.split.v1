import Record from './components/Record';
import {cloneDeep} from 'lodash';

// access this by $this.store.state.<list>
const state = {
	list: [],
	current: ''
}

// access this by $this.store.getters.<getList>
const getters = {
	getList(state){ return state.list; },
	getCurrent(state){ return state.current; }
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const loadFile = 'load-file-action';
export const loadSave = 'load-save-action';
export const selectCurrent = 'select-current-action';
const actions = 
{
	[loadFile]({commit}, files)
	{
		let list = [];
		for(let file of files)
		{
			let record = cloneDeep(Record);
				record.name = file.name;
			list.push(record);
		}
		commit('list', list);
	},
	[loadSave]({commit}, value)
	{
		console.log('loadSave', value, commit);
	},
	[selectCurrent]({commit}, value)
	{
		console.log('changeCurrent', value);
		commit('setCurrent', value);
	},
}

// access this by $this.store.commit(<setList>, value)
const mutations = 
{
	list(state, value){ state.list = value; },
	current(state, value){ state.current = value; }
}

export default { state, getters, actions, mutations };