import {record} from './records';
import {getDeepCopy} from '../lib/getDeepCopy';
import {getRandomHash} from '../lib/getRandomHash';

export const blueprint =
{
	id: '',
	regexp: new RegExp('','g'),
	source: getDeepCopy(record.source),
	metrics: getDeepCopy(record.metrics),
}

// access this by this.$store.state.<list>
const state = {
	blueprints: new Map(),
	blueprint: null,
}

// access this by this.$store.getters.<list>
const getters = {
	blueprints(state)
	{
		return Array.from(state.blueprints, element => element[1]);
	},
	blueprint(state)
	{
		return state.blueprints.get(state.blueprint) ?? null;
	}
}

// access this by this.$store.dispatch('load-file', value)
export const addBlueprint = 'add-blueprint-action';
export const updateBlueprint = 'update-blueprint-action';
export const removeBlueprint = 'remove-blueprint-action';
export const selectBlueprint = 'select-blueprint-action';
const actions = 
{
	[addBlueprint]({state, commit})
	{
		const instance = getDeepCopy(blueprint);
		while(instance.id === '' || state.blueprints.has(instance.id)) instance.id = getRandomHash(16);
		state.blueprints.set(instance.id, instance);
		commit('blueprints', new Map(state.blueprints));
	},
	[updateBlueprint]({state, commit}, blueprint)
	{
		state.blueprints.set(blueprint.id, getDeepCopy(blueprint));
		commit('blueprints', new Map(state.blueprints));
	},
	[removeBlueprint]({state, commit}, blueprint)
	{
		state.blueprints.delete(blueprint.id)
		commit('blueprints', new Map(state.blueprints));
	},
	[selectBlueprint]({commit}, blueprint)
	{
		commit('blueprint', blueprint?.id ?? null);
	}
}

// access this by this.$store.commit('record', value)
const mutations = 
{
	blueprints(state, blueprints){ state.blueprints = blueprints },
	blueprint(state, blueprint){ state.blueprint = blueprint },
}

export default { state, getters, actions, mutations };