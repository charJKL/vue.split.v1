<template>[
	name: <input class="input-text" v-model="current.filename" @update:modelValue="updateSource" />,
	<template v-for="metric in local" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input class="input-int" v-if="isLine(metric.type)" type="number" :disabled="metric.isDisabled" :value="metric.value" @input="changeLocalValue(metric, $event), updateMetrics()" @focus="onFocus(metric)"/>
			<input class="input-float" v-if="isFloat(metric.type)" type="number" step="0.1" :disabled="metric.isDisabled" :value="metric.value" @input="changeLocalValue(metric, $event), updateMetrics()" @focus="onFocus(metric)"/>
		</label>,
	</template>]
</template>

<script>
import EditorMixin from './mixins/EditorMixin';
import {updateSource, updateMetrics} from './mixins/EditorMixin';

export default
{
	mixins: [EditorMixin],
	data()
	{
		return {
			focus: null,
		}
	},
	watch:
	{
		source(source)
		{
			if(this.isSourceNull === true) return;
			this.calcCurrent(source);
		},
		metrics(metrics)
		{
			if(this.isMetricsNull === true) return;
			this.calcLocal(metrics);
		}
	},
	methods:
	{
		initLocal()
		{
			this.local.x1.isDisabled = this.isMetricsNull;
			this.local.x2.isDisabled = this.isMetricsNull;
			this.local.y1.isDisabled = this.isMetricsNull;
			this.local.y2.isDisabled = this.isMetricsNull;
			this.local.rotate.isDisabled = this.isMetricsNull;
		},
		calcCurrent(source)
		{
			this.current.filename = source.filename;
		},
		calcLocal(metrics)
		{
			this.local.x1.value = metrics.x1.value;
			this.local.x2.value = metrics.x2.value;
			this.local.y1.value = metrics.y1.value;
			this.local.y2.value = metrics.y2.value;
		},
		updateSource()
		{
			const source = this.getSourceInstance();
					source.filename = this.current.filename;
			this.$emit(updateSource, source);
		},
		updateMetrics()
		{
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.local.x1.value;
					metrics.x2.value = this.local.x2.value;
					metrics.y1.value = this.local.y1.value;
					metrics.y2.value = this.local.y2.value;
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
		},
		changeLocalValue(metric, e)
		{
			const value = this.parseType(metric.type, e.target.value);
			if(metric.name === 'x1' && this.local.x1.value > this.local.x2.value) this.focus = this.local.x2;
			if(metric.name === 'x2' && this.local.x1.value < this.local.x2.value) this.focus = this.local.x1;
			if(metric.name === 'y1' && this.local.y1.value > this.local.y2.value) this.focus = this.local.y2;
			if(metric.name === 'y2' && this.local.y1.value < this.local.y2.value) this.focus = this.local.y1;
			
			this.focus.value = value;
		},
		onFocus(metric)
		{
			console.log('focus', metric);
			this.focus = metric;
		},
		parseType(type, value)
		{
			return type === 'line' ? parseInt(value) : parseFloat(value);
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