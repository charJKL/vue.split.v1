<template>[
	name: <input class="input-text" v-model="internal.filename" @update:modelValue="updateSource" />,
	<template v-for="metric in local" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input class="input-int" v-if="isLine(metric.type)" type="number" :disabled="metric.isDisabled" v-model.number="metric.value" @update:modelValue="updateMetrics(metric.name, metric.value)" />
			<input class="input-float" v-if="isFloat(metric.type)" type="number" step="0.1" :disabled="metric.isDisabled" v-model.number="metric.value" @update:modelValue="updateMetrics(metric.name, metric.value)" />
		</label>,
	</template>]
</template>

<script>
import record from '../store/record';
import {isMatch} from '../core/isMatch';
import {cloneDeep} from 'lodash';

const updateSource = 'update:source';
const updateMetrics = 'update:metrics';

export default
{
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
		metrics: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
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
			return cloneDeep(this.isSourceNull ? record.source : this.source);
		},
		local()
		{
			return this.wrapMetrics(cloneDeep(this.isMetricsNull ? record.metrics : this.metrics));
		}
	},
	methods:
	{
		updateSource()
		{
			const source = cloneDeep(this.source);
					source.filename = this.internal.filename;
			this.$emit(updateSource, source);
		},
		updateMetrics(name, value)
		{
			console.log('update:', name, value);
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
			metrics.x1.isDisabled = this.isMetricsNull;
			metrics.x2.isDisabled = this.isMetricsNull;
			metrics.y1.isDisabled = this.isMetricsNull;
			metrics.y2.isDisabled = this.isMetricsNull;
			metrics.rotate.isDisabled = this.isMetricsNull;
			
			return metrics;
		},
		isLine(type)
		{
			return type === 'line';
		},
		isFloat(type)
		{
			return type === 'float';
		}
	}
}
</script>

<style scoped>
input
{
	margin: 0px 5px 0px 0px;
}
</style>