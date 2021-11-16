<template>[
	name: <input class="input-text" v-model="current.filename" @update:modelValue="updateSource" @focus="onSourceFocus" @blur="onSourceBlur"/>,
	<template v-for="metric in local" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input class="input-int" v-if="isLine(metric.type)" type="number" :disabled="metric.isDisabled" :value="metric.value" @input="onInput($event, metric), updateMetrics()" @focus="onFocus($event, metric)" @blur="onBlur($event, $metric)"/>
			<input class="input-float" v-if="isFloat(metric.type)" type="number" step="0.1" :disabled="metric.isDisabled" :value="metric.value" @input="onInput($event, metric), updateRotation(), updateMetrics()" @focus="onFocus($event, metric)" @blur="onBlur($event, metric)"/>
		</label>,
	</template>]
</template>

<script>
import EditorBase from './mixins/EditorBase';
import EditorOffset from './mixins/EditorOffset';
import EditorInputMouse from './EditorInputMouse';
import {updateSource, updateMetrics} from './mixins/EditorBase';
import {toRef} from 'vue';

export default
{
	mixins: [EditorBase, EditorOffset, EditorInputMouse],
	data()
	{
		return {
			focus: null,
		}
	},
	methods:
	{
		initLocal()
		{
			this.local.x1.isDisabled = toRef(this, 'isMetricsNull');
			this.local.x2.isDisabled = toRef(this, 'isMetricsNull');
			this.local.y1.isDisabled = toRef(this, 'isMetricsNull');
			this.local.y2.isDisabled = toRef(this, 'isMetricsNull');
			this.local.rotate.isDisabled = toRef(this, 'isMetricsNull');
		},
		updateSource()
		{
			const source = this.getSourceInstance();
					source.filename = this.current.filename;
			this.$emit(updateSource, source);
		},
		updateRotation()
		{
			this.calcOffset(this.current.size, this.local.rotate.value);
			console.log('updateRotation', this.local.rotate.value, this.offset);
			this.local.x1.value = this.offseted.x1.value - this.offset.x;
			this.local.x2.value = this.offseted.x2.value - this.offset.x;
			this.local.y1.value = this.offseted.y1.value - this.offset.y;
			this.local.y2.value = this.offseted.y2.value - this.offset.y;
		},
		updateMetrics()
		{
			console.log('updateMetrics');
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.local.x1.value;
					metrics.x2.value = this.local.x2.value;
					metrics.y1.value = this.local.y1.value;
					metrics.y2.value = this.local.y2.value;
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
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