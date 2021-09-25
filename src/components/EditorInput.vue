<template>[
	name: <input class="input-text" ref="name" :value="name" @input="onInputNameEvent" />
	<template v-for="metric in metrics" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input :value="metric.value" />
		</label>,
	</template>]
</template>

<script>
import Record from './Record';
import {isMatch} from '../core/isMatch';
import {cloneDeep} from 'lodash';

export default
{
	props:
	{
		name: { type: String },
		metrics: { type: Object, required: true, validator(value){ return isMatch(Record.metrics, value); } },
	},
	emits: ['update:name', 'update:metrics'],
	computed:
	{
		metric()
		{
			return this.metric.filter();
		}
	},
	methods:
	{
		isLine(type)
		{
			return type === 'line';
		},
		isFloat(type)
		{
			return type === 'float';
		},
		getValue(name)
		{
			this.metrics[name].value;
		},
		onInputIntEvent(name, e)
		{
			this.onInputEvent(name, parseInt(e.target.value));
		},
		onInputFloatEvent(name, e)
		{
			this.onInputEvent(name, parseFloat(e.target.value));
		},
		onInputNameEvent(value)
		{
			this.$emit('update:name', value);
		},
		onInputEvent(name, value)
		{
			const metrics = cloneDeep(this.metrics);
					metrics[name].value = value;
			this.$emit('update:metrics', metrics);
		}
	}
}
</script>

<style scoped>

</style>