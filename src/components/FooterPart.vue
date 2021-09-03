<template>
<footer>
	<div>
		<template v-if="current">
		[
			name:<input class="input-text" :value="current.name" />,
			<template  v-for="(metric, name, index) in current.metrics" :key="index">
				<label>{{ name }}:
					<input v-if="metric.type === 'value'" class="input-float" step="0.1" type="number" v-model="metric.value" @input="onInputFloatEvent(name, $event)" />
					<input v-else-if="metric.type === 'manual'" class="input-checkbox" type="checkbox" v-model="metric.value" @checked="onInputEvent(name, $event)"/>
					<input v-else class="input-int" type="number" v-model="metric.value" @input="onInputIntEvent(name, $event)" />
				</label>,
			</template>
		]
		</template>
	</div>
	<div>
		<button id="save" @click="this.$emit('save')">Save</button>
	</div>
</footer>
</template>

<script>
import _ from 'lodash';

export default
{
	props:
	{
		current: { type: Object, requred: true },
	},
	methods:
	{
		onInputIntEvent(name, e)
		{
			this.onInputEvent(name, parseInt(e.target.value));
		},
		onInputFloatEvent(name, e)
		{
			this.onInputEvent(name, parseFloat(e.target.value));
		},
		onInputEvent(name, value)
		{
			const current = _.cloneDeep(this.current);
					current.metrics[name].value = value;
			this.$emit('update:current', current);
		}
	}
}
</script>

<style>
footer
{
	flex: 0 0 auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
</style>