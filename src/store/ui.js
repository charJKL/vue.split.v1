// access this by $this.store.state.<list>


export const Stage = { Metrics: 'Metrics', Text: 'Text' };

const state = {
	stage: Stage.Metrics,
	focus: null,
	search: null,
	hover: '',
}

// access this by $this.store.getters.<stage>
const getters = {
	stage(state)
	{
		return state.stage;
	},
	focus(state)
	{
		return state.focus;
	},
	search(state)
	{
		return state.search;
	},
	hover(state)
	{
		return state.hover;
	}
}

// access this by $this.store.dispatch(<load-file>, value)
// in actions i should call commits()
export const setStage = 'set-stage-action';
export const setHover = 'set-hover-action';
export const setFocus = 'set-focus-action';
export const setSearching = 'set-searching-action';
const actions = 
{
	[setStage]({commit}, name)
	{
		commit('stage', name);
	},
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
		try
		{
			commit('searching', new RegExp(pattern));
			return true;
		}catch(e){
			return e;
		}
	}
}

// access this by $this.store.commit('hover', value)
const mutations = 
{
	stage(state, name){ state.stage = name; },
	hover(state, name){ state.hover = name; },
	focus(state, name){ state.focus = name; },
	searching(state, pattern){ state.searching = pattern; }
}

export default { state, getters, actions, mutations };