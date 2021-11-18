<template>
	<mask id="mask">
		<rect class="mask-blackout" />
		<rect class="mask-spot" :style="getSpotStyle"/>
	</mask>
	<rect class="size" :style="getSizeStyle" mask="url(#mask)"  />
</template>

<script>
import {isMatch} from '../lib/isMatch';
import {record} from '../store/records';

const blueprint = 
{
	size: {width: 0, height: 0},
	offset: {top: 0, right: 0, bottom: 0, left: 0},
}

export default
{
	props:
	{
		size: { type: Object, required: true, validator(value){ return isMatch(blueprint.size, value); } },
		offset: { type: Object, required: true, validator(value){ return isMatch(blueprint.offset, value); } },
		metrics: { type: Object, required: true, validator(value){ return isMatch(record.metrics, value); } },
	},
	computed:
	{
		getSizeStyle()
		{
			return {x: this.offset.left, y: this.offset.top, width: this.size.width, height: this.size.height };
		},
		getSpotStyle()
		{
			const x = this.offset.left + this.metrics.x1.value;
			const y = this.offset.top + this.metrics.y1.value;
			const width = this.metrics.x2.value - this.metrics.x1.value;
			const height = this.metrics.y2.value - this.metrics.y1.value;
			return {x: x, y: y, width: width, height: height };
		},
	}
}
</script>

<style scoped>
.size
{
	fill: rgba(0, 0, 0, .3);
}
.mask-blackout
{
	fill: #fff;
	x: 0;
	y: 0;
	width: 100%;
	height: 100%;
}
.mask-visible
{
	fill: #000;
}
</style>