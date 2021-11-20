// access this by $this.store.state.<list>


export const Stage = { Metrics: 'Metrics', Text: 'Text' };

const state = {
	stage: Stage.Metrics,
	hover: '',
	focus: '',
	searching: '',
}

// access this by $this.store.getters.<stage>
const getters = {
	stage(state)
	{
		return state.stage;
	},
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
			new RegExp(pattern);
		}catch(e){
			console.error(e);
			return;
		}
		
		commit('searching', pattern);
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