<template>[
	name: <input class="input-text" v-model="internal.filename" @update:modelValue="updateSource" />,
	<template v-for="metric in local" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input class="input-int" v-if="isLine(metric.type)" type="number" :disabled="metric.isDisabled" v-model.number="metric.value" @update:modelValue="updateMetrics" />
			<input class="input-float" v-if="isFloat(metric.type)" type="number" step="0.1" :disabled="metric.isDisabled" v-model.number="metric.value" @update:modelValue="updateMetrics" />
		</label>,
	</template>]
</template>

<script>
import Record from './Record';
import {isMatch} from '../core/isMatch';
import {cloneDeep} from 'lodash';

const updateSource = 'update:source';
const updateMetrics = 'update:metrics';

export default
{
	props:
	{
		source: { type: Object, validator(value){ return isMatch(Record.source, value); } },
		metrics: { type: Object, validator(value){ return isMatch(Record.metrics, value); } },
	},
	emits: [updateSource, updateMetrics],
	computed:
	{
		isSourceNull()
		{
			return this.source === null;
		},
		isMetricsNull()
		{
			return this.metrics === null;
		},
		internal()
		{
			return cloneDeep(this.isSourceNull ? Record.source : this.source);
		},
		local()
		{
			return this.wrapMetrics(cloneDeep(this.isMetricsNull ? Record.metrics : this.metrics));
		}
	},
	watch:
	{
		
	},
	methods:
	{
		updateSource()
		{
			const source = cloneDeep(this.source);
			this.$emit(updateSource, source);
		},
		updateMetrics()
		{
			const metrics = cloneDeep(this.metrics);
					metrics.x1.value = this.local.x1.value;
					metrics.x2.value = this.local.x2.value;
					metrics.y1.value = this.local.y1.value;
					metrics.y2.value = this.local.y2.value;
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
		},
		wrapMetrics(metrics)
		{
			metrics.x1.isDisabled = this.isSourceNull;
			metrics.x2.isDisabled = this.isSourceNull;
			metrics.y1.isDisabled = this.isSourceNull;
			metrics.y2.isDisabled = this.isSourceNull;
			metrics.rotate.isDisabled = this.isSourceNull;
			
			return metrics;
		},
		isLine(type)
		{
			return type === 'line';
		},
		isFloat(type)
		{
			return type === 'float';
		},
		onInputTextEvent(name, e)
		{
			this.updateSource(name, e.target.value);
		},
	}
}
</script>

<style scoped>
input
{
	margin: 0px 5px 0px 0px;
}
</style>