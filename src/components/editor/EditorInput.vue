<template>
	<div>
	[
		<label>name: <input :value="getNameValue"/></label>,
		<label>x1: <input type="number" :value="getX1Value" @input="updateMetrics('x1', $event)"/></label>,
		<label>x2: <input type="number" :value="getX2Value" @input="updateMetrics('x2', $event)"/></label>,
		<label>y1: <input type="number" :value="getY1Value" @input="updateMetrics('y1', $event)"/></label>,
		<label>y2: <input type="number" :value="getY2Value" @input="updateMetrics('y2', $event)"/></label>,
		<label>rotate: <input type="number" step="0.1" :value="getRotateValue"/></label>
	]
	</div>
</template>

<script>
import RequireMetrics, {updateMetrics} from './mixins/RequireMetrics';
import RequireSource from './mixins/RequireSource';

export default
{
	mixins: [RequireSource, RequireMetrics],
	computed:
	{
		getNameValue()
		{
			return this.source?.filename ?? '';
		},
		getX1Value()
		{
			return this.metrics?.x1 ?? 0;
		},
		getX2Value()
		{
			return this.metrics?.x2 ?? 0;
		},
		getY1Value()
		{
			return this.metrics?.y1 ?? 0;
		},
		getY2Value()
		{
			return this.metrics?.y2 ?? 0;
		},
		getRotateValue()
		{
			return this.metrics?.rotate ?? 0;
		}
	},
	methods:
	{
		updateMetrics(metric, e)
		{
			const metrics = {...this.metrics};
					metrics[metric] = e.target.value;
			this.$emit(updateMetrics, metrics);
		}
	}
}
</script>

<style scoped>

</style>