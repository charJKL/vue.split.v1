// access this by $this.store.state.<list>
const state = {
	hover: '',
}

// access this by $this.store.getters.<getList>
const getters = {
	getHover(state)
	{ 
		return state.hover;
	},
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const changeHover = 'change-hover-action';
const actions = 
{
	[changeHover]({commit}, name)
	{
		commit('hover', name);
	},
}

// access this by $this.store.commit(<setList>, value)
const mutations = 
{
	hover(state, name){ state.hover = name; }
}

export default { state, getters, actions, mutations };