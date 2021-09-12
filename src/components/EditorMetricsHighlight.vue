<template>
	<mask id="view">
		<rect class="view-shadow" />
		<rect class="view-highlight" :style="getHighlightStyle" />
	</mask>
	<rect class="area" mask="url(#view)" :style="getAreaStyle" />
</template>

<script>
import {isMatch} from 'lodash';

const blueprintRect = {asd: 0};

export default
{
	props:
	{
		area: { type: Object, required: true, validator(value){ return isMatch(value, blueprintRect); } },
		highlight: { type: Object, required: true, validator(value){ return isMatch(value, blueprintRect); } },
	},
	computed:
	{
		getAreaStyle()
		{
			return {x: this.area.x, y: this.area.y, width: this.area.width, height: this.area.height };
		},
		getHighlightStyle()
		{
			return {x: this.highlight.x, y: this.highlight.y, width: this.highlight.width, height: this.highlight.height };
		},
	}
}
</script>

<style scoped>
.area
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
.view-highlight
{
	fill: #000;
}
</style>