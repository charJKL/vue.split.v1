<template>
	name: <input class="input-text" :value="getCurrentName" @input="onCurrentNameInput" />
	<template v-for="metric in metrics" :key="metric.name">
		<label>
			{{ metric.name }}:
			<input class="input-int" v-if="isLine(metric.type)" type="number" :disabled="!isCurrent" :value="getValue(metric.name)" @input="onInputIntEvent(metric.name, $event)" />
			<input class="input-float" v-else-if="isFloat(metric.type)" type="number" step="0.1" :disabled="!isCurrent" :value="getValue(metric.name) " @input="onInputFloatEvent(metric.name, $event)" />
		</label>,
	</template>
</template>

<script>
import Record from './Record';
import {changeCurrent, updateMetrics} from '../store/records';
import {cloneDeep} from 'lodash';

export default
{
	data()
	{
		return {
			metrics: Record.metrics,
		}
	},
	computed:
	{
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		},
		current()
		{
			return this.$store.getters.getCurrent;
		},
		getCurrentName()
		{
			return this.isCurrent === true ? this.current.source.filename : '';
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
			return this.isCurrent === true ? this.current.metrics[name].value : '' ;
		},
		onCurrentNameInput(e)
		{
			this.$store.dispatch(changeCurrent, e.target.value);
		},
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
			const metrics = cloneDeep(this.current.metrics);
					metrics[name].value = value;
			this.$store.dispatch(updateMetrics, metrics);
		}
	}
}
</script>

<style>

</style>