import { createStore } from 'vuex'

const store = createStore({
	state()
	{
		return {
			list: [],
			current: ''
		}
	},
	mutations: 
	{
		list(state, value)
		{
			state.list = value;
		},
		current(state, value)
		{
			state.current = value;
		},
		metrics(state, value)
		{
			state.list[state.current].metrics = value;
		}
	}
});

export default store;