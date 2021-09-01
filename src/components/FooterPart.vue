<template>
<footer>
	<div>
		<template v-if="current">
		[
			<input :value="current.name" />,
			<template  v-for="(metric, key, index) in current.metrics" :key="index">
				{{ key }}:
				<input v-if="metric.type === 'value'" class="input" step="0.1" type="number" v-model="metric.value" @input="onInputFloatEvent(key, $event)" />
				<input v-else class="input" type="number" v-model="metric.value" @input="onInputIntEvent(key, $event)" />
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
export default
{
	props:
	{
		current: { type: Object, requred: true },
	},
	methods:
	{
		onInputIntEvent(key, e)
		{
			this.onInputEvent(key, parseInt(e.target.value));
		},
		onInputFloatEvent(key, e)
		{
			this.onInputEvent(key, parseFloat(e.target.value));
		},
		onInputEvent(key, value)
		{
			const current = Object.assign({}, this.current);
					current.metrics[key].value = value;
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
.input
{
	width: 100px;
}
</style>