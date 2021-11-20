<template>
	<div>
	[
	<label>name: <input class="input-text" ref="source" v-model="current.filename" @update:modelValue="updateSource" @focus="onSourceFocus" @blur="onSourceBlur"/></label>,
	<label>{{ local.x1.name }}:<input type="number" :disabled="local.x1.isDisabled" :value="local.x1.value" @input="onInput($event, local.x1), updateMetrics()" @focus="onFocus($event, local.x1)" @blur="onBlur($event, local.x1)"/></label>,
	<label>{{ local.x2.name }}:<input type="number" :disabled="local.x2.isDisabled" :value="local.x2.value" @input="onInput($event, local.x2), updateMetrics()" @focus="onFocus($event, local.x2)" @blur="onBlur($event, local.x2)"/></label>,
	<label>{{ local.y1.name }}:<input type="number" :disabled="local.y1.isDisabled" :value="local.y1.value" @input="onInput($event, local.y1), updateMetrics()" @focus="onFocus($event, local.y1)" @blur="onBlur($event, local.y1)"/></label>,
	<label>{{ local.y2.name }}:<input type="number" :disabled="local.y2.isDisabled" :value="local.y2.value" @input="onInput($event, local.y2), updateMetrics()" @focus="onFocus($event, local.y2)" @blur="onBlur($event, local.y2)"/></label>,
	<label>{{ local.rotate.name }}:<input type="number" step="0.1" :disabled="local.rotate.isDisabled" :value="local.rotate.value" @input="onInput($event, local.rotate), updateMetrics()" @focus="onFocus($event, local.rotate)" @blur="onBlur($event, local.rotate)"/></label>
	]
	</div>
</template>

<script>
import EditorBase from './mixins/EditorBase';
import EditorInputMouse from './EditorInputMouse';
import {updateSource, updateMetrics} from './mixins/EditorBase';
import {isMatch} from '../lib/isMatch';
import {toRef} from 'vue';

export const inputs = 
{
	source: { invalid: '' },
	x1: { invalid: '' },
	x2: { invalid: '' },
	y1: { invalid: '' },
	y2: { invalid: '' },
	rotate: { invalid: '' }
}

export default
{
	mixins: [EditorBase, EditorInputMouse],
	props:
	{
		inputs: { type: Object, default: inputs, validator(value){ return isMatch(inputs, value); } },
	},
	watch:
	{
		inputs: {
			deep: true,
			handler(value)
			{
				for(let [name, input] of Object.entries(value))
				{
					if(this.$refs[name] === undefined) continue;
					if(input.invalid !== undefined)
					{
						this.$refs[name].setCustomValidity(input.invalid);
						this.$refs[name].reportValidity();
					}
				}
			}
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
		updateMetrics()
		{
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.local.x1.value;
					metrics.x2.value = this.local.x2.value;
					metrics.y1.value = this.local.y1.value;
					metrics.y2.value = this.local.y2.value;
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
		}
	}
}
</script>

<style scoped>
label
{
	margin: 0px 0px 0px 5px;
	font: 16px / 24px var(--font);
}
label:first-child{ margin-left: 0px; }
input
{
	box-sizing: border-box;
	height: 30px;
	font: 16px / 24px var(--font);
	width: 100px;
}
input:invalid
{
	border: solid 1px red;
}
button
{
	box-sizing: border-box;
	height: 30px;
	font: 16px / 24px var(--font);
	width: 100px;
}
.input-text
{
	width: 220px;
}
</style>