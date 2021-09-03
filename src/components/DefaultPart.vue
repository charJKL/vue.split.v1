<template>
<section v-if="show === false" class="default-collapsed">
	<toggle-button v-model="show" on="Hide defaults" off="Show defaults" ></toggle-button>
</section>
<section v-else class="default-list">
	<div class="default-list-row">
		<toggle-button v-model="show" on="Hide defaults" off="Show defaults" ></toggle-button>
		<button @click="onAdd">Add</button>
	</div>
	<div v-for="(blueprint, index) in blueprints" :key="index" class="default-list-row">
		[
			name:<input class="input-text" v-model="blueprint.regexp" />,
			<template v-for="(metric, name) in blueprint.metrics" :key="name">
				<label>{{ name }}:
					<input v-if="metric.type === 'value'" class="input-float" step="0.1" type="number" v-model="metric.value" />
					<input v-else-if="metric.type === 'manual'" class="input-checkbox" type="checkbox" v-model="metric.value" />
					<input v-else class="input-int" type="number" v-model="metric.value" />
				</label>,
			</template>
		]
		<button @click="onApply(blueprint)" >Apply</button>
	</div>
</section>
</template>

<script>
import ToggleButton from './utils/ToggleButton';
import _ from 'lodash';

export default
{
	components: { ToggleButton },
	props:
	{
		metrics: { type: Object, requred: true }
	},
	emits: ['apply-blueprint'],
	data()
	{
		return {
			blueprints: [],
			show: false,
		}
	},
	created()
	{
		this.onAdd();
	},
	methods:
	{
		onAdd()
		{
			const blueprint = { regexp: '', metrics: _.cloneDeep(this.metrics) };
			this.blueprints.unshift(blueprint);
		},
		onApply(blueprint)
		{
			this.$emit('apply-blueprint', blueprint);
		}
	}
}
</script>

<style>
.default-collapsed
{
	position: absolute;
	left: 0px;
	bottom: 50px;
	padding: 10px;
}
.default-list
{
	width: calc(100% - 20px);
	position: absolute;
	left: 0px;
	bottom: 50px;
	padding: 10px;
	z-index: 5;
	background: var(--gray-light);
}
.default-list-row:not(:last-child)
{
	margin: 0 0 10px 0px;
}
</style>

