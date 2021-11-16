// access this by $this.store.state.<list>
const state = {
	hover: '',
	focus: '',
	searching: '',
}

// access this by $this.store.getters.<getList>
const getters = {
	hover(state)
	{
		return state.hover;
	},
	focus(state)
	{
		return state.focus;
	},
	searching(state)
	{
		return state.searching;
	}
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const setHover = 'set-hover-action';
export const setFocus = 'set-focus-action';
export const setSearching = 'set-searching-action';
const actions = 
{
	[setHover]({commit}, name)
	{
		commit('hover', name);
	},
	[setFocus]({commit}, name)
	{
		commit('focus', name);
	},
	[setSearching]({commit}, pattern)
	{
		commit('searching', pattern);
	}
}

// access this by $this.store.commit('hover', value)
const mutations = 
{
	hover(state, name){ state.hover = name; },
	focus(state, name){ state.focus = name; },
	searching(state, pattern){ state.searching = pattern; }
}

export default { state, getters, actions, mutations };