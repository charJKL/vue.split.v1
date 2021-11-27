<template>
	<button @click="onClick">
		<input type="checkbox" :checked="state" />
		{{ state ? on : off }}
	</button>
</template>

<script>
export default
{
	props:
	{
		modelValue: { type: Boolean, default: false },
		on: { type: String, default: 'On' },
		off: { type: String, default: 'Off' },
	},
	emits: ['update:modelValue'],
	data()
	{
		return {
			state: this.modelValue,
		}
	},
	methods: 
	{
		onClick()
		{
			this.state = !this.state;
			this.$emit('update:modelValue', this.state);
		}
	}
}
</script>

<style scoped>
input
{
	margin: 0px;
}
</style>

