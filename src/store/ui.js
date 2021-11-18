// access this by $this.store.state.<list>

export const tabMetricsPreview = 'tab-metrics-preview';
export const tabPreviewText = 'tab-preview-text';

const state = {
	tab: tabMetricsPreview,
	hover: '',
	focus: '',
	searching: '',
}

// access this by $this.store.getters.<getList>
const getters = {
	tab(state)
	{
		return state.tab;
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
export const setTab = 'set-tab-action';
export const setHover = 'set-hover-action';
export const setFocus = 'set-focus-action';
export const setSearching = 'set-searching-action';
const actions = 
{
	[setTab]({commit}, name)
	{
		commit('tab', name);
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
	tab(state, name){ state.tab = name; },
	hover(state, name){ state.hover = name; },
	focus(state, name){ state.focus = name; },
	searching(state, pattern){ state.searching = pattern; }
}

export default { state, getters, actions, mutations };