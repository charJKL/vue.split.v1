<template>
	<mask id="view">
		<rect class="view-shadow" />
		<rect class="view-spot" :style="getSpotStyle" />
	</mask>
	<rect class="size" mask="url(#view)" :style="getSizeStyle" />
</template>

<script>
import {isMatch} from '../lib/isMatch';

const blueprint = 
{
	rect: {x: 0, y:0, width: 0, height: 0},
}

export default
{
	props:
	{
		size: { type: Object, required: true, validator(value){ return isMatch(blueprint.rect, value); } },
		spot: { type: Object, required: true, validator(value){ return isMatch(blueprint.rect, value); } },
	},
	computed:
	{
		getSizeStyle()
		{
			return {x: this.size.x, y: this.size.y, width: this.size.width, height: this.size.height };
		},
		getSpotStyle()
		{
			return {x: this.spot.x, y: this.spot.y, width: this.spot.width, height: this.spot.height };
		},
	}
}
</script>

<style scoped>
.size
{
	x: 0;
	y: 0;
	width: 100%;
	height: 100%;
	fill: rgba(0, 0, 0, .3);
}
.view-shadow
{
	fill: #fff;
	x: 0;
	y: 0;
	width: 100%;
	height: 100%;
}
.view-spot
{
	fill: #000;
}
</style>