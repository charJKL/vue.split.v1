
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
const actions = 
{
	loadFile({commit}, value)
	{
		console.log('load-file actions');
		commit('setList', value);
	},
	loadSave()
	{
		console.log('load-save action');
	}
}


const LOAD_FILE = 'load-file';
// access this by $this.store.commit(<setList>, value)
const mutations = 
{
	[LOAD_FILE](state, value){ state.list = value; },
	setList(state, value){ state.list = value; },
	setCurrent(state, value){ state.current = value; }
}

export default{ namespaced: true, state, getters, actions, mutations };
