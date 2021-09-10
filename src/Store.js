
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
		console.log('loadFile');
		commit('setList', value);
	},
	loadSave({commit}, value)
	{
		console.log('loadSave', value, commit);
	},
	changeCurrent({commit}, value)
	{
		console.log('changeCurrent', value);
		commit('setCurrent', value);
	},
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
