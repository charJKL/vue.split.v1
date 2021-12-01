<template>
	<line :class="['line', getLineClass]" :x1="x1" :y1="y1" :x2="x2" :y2="y2" />
	<text :x="x1" :y="y1" class="small">{{ name }}</text>
</template>

<script>
import {offset} from './EditorMetrics';
import {isMatch} from '../../lib/isMatch';

export default
{
	props: 
	{
		offset: { type: Object, required: true, validator(value){ return isMatch(offset, value); } },
		value: { type: Number, requred: true },
		type: { type: String, requred: true, validator(value){ return value == 'horizontal' || value == 'vertical' } },
		hover: { type: Boolean, requred: false },
		name: { type: String, requred: false },
	},
	computed:
	{
		getLineClass()
		{
			return this.hover === true ? 'is-hover' : '';
		},
		x1()
		{
			if(this.type === 'horizontal') return 0;
			if(this.type === 'vertical') return this.value + this.offset.left;
			throw new Error(`Line type ${this.type} is wrong`);
		},
		x2()
		{
			if(this.type === 'horizontal') return '100%';
			if(this.type === 'vertical') return this.value + this.offset.left;
			throw new Error(`Line type ${this.type} is wrong`);
		},
		y1()
		{
			if(this.type === 'horizontal') return this.value + this.offset.top;
			if(this.type === 'vertical') return 0;
			throw new Error(`Line type ${this.type} is wrong`);
		},
		y2()
		{
			if(this.type === 'horizontal') return this.value + this.offset.top;
			if(this.type === 'vertical') return '100%';
			throw new Error('Line type $`this.type`is wrong');
		}
	},
}
</script>

<style scoped>
.line
{
	stroke: #000;
	stroke-width: 1;
	stroke-dasharray: 4 2;
}
.line.is-hover
{
	stroke: rgb(255, 50, 50);
}
</style>