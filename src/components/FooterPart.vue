<template>
<footer>
	<div>
		<template v-if="current">
		[
			<input :value="current.name" />,
			<template  v-for="(metric, name, index) in current.metrics" :key="index">
				{{ name }}:
				<input v-if="metric.type === 'value'" class="input" step="0.1" type="number" v-model="metric.value" @input="onInputFloatEvent(name, $event)" />
				<input v-else-if="metric.type === 'manual'" class="input" type="checkbox" v-model="metric.value" @checked="onInputEvent(name, $event)"/>
				<input v-else class="input" type="number" v-model="metric.value" @input="onInputIntEvent(name, $event)" />,
			</template>
		]
		</template>
	</div>
	<div>
		<button id="preview">Preview</button>
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
.input[type='number']
{
	width: 100px;
}
.input[type='checkbox']
{
	position: relative;
	top: 6px;
	height: 25px;
	width: 25px;
	margin: 0px;
	padding: 0px;
}
</style>