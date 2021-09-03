<template>
<section class="default">
	<div class="row">
		<button @click="onAdd">Add</button>
	</div>
	<div v-for="(blueprint, index) in blueprints" :key="index" class="blueprint">
		[
			regexp:<input class="input-text" v-model="blueprint.regexp" />,
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
import _ from 'lodash';

export default
{
	props:
	{
		metrics: { type: Object, requred: true }
	},
	emits: ['apply-blueprint'],
	data()
	{
		return {
			blueprints: [],
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
.default
{
	width: 100%;
	position: absolute;
	left: 0px;
	bottom: 50px;
	background: var(--gray-light);
	z-index: 5;
}
.row
{
	padding: 10px 10px 0 10px;
}
.blueprint
{
	padding: 10px;
}
</style>

