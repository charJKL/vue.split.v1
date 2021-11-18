<template>
<div :class="['preview']" ref="preview" :style="getEditorStyle">
	<canvas class="canvas" ref="canvas"></canvas>
</div>
</template>

<script>
import {isMatch} from '../lib/isMatch';
import {record} from '../store/records';

export default
{
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
		metrics: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
	},
	data()
	{
		return {
			mounted: false,
			viewport: {width: 0, height: 0},
			canvas: null,
			temp: null,
		}
	},
	computed:
	{
		getEditorStyle()
		{
			if(this.mounted == false) return {};
			return { width: `${this.viewport.width}px`, height: `${this.viewport.height}px` };
		}
	},
	watch:
	{
		source: 'paint',
		metrics: 'paint'
	},
	mounted()
	{
		this.viewport = {width: this.$refs.preview.offsetWidth, height: this.$refs.preview.offsetHeight };
		this.canvas = this.$refs.canvas;
		this.temp = document.createElement("canvas");
		this.mounted = true;
	},
	methods:
	{
		paint()
		{
			this.drawRotate(this.temp);
			this.drawClip(this.temp, this.canvas);
		},
		drawRotate(canvas)
		{
			canvas.width = this.source.size.width;
			canvas.height = this.source.size.height;
			const context = canvas.getContext("2d");
			
			const halfX = this.source.size.width / 2;
			const halfY = this.source.size.height / 2;
			
			context.translate(halfX, halfY);
			context.rotate(this.metrics.rotate.value * Math.PI / 180);
			context.translate(halfX * -1, halfY * -1);
			context.drawImage(this.source.img, 0, 0);
		},
		drawClip(source, destination)
		{
			const width = this.metrics.x2.value - this.metrics.x1.value;
			const height = this.metrics.y2.value - this.metrics.y1.value;
			
			destination.width = width;
			destination.height = height;
			const context = destination.getContext("2d");
			context.drawImage(source, this.metrics.x1.value, this.metrics.y1.value, width, height, 0, 0, width, height);
		}
	}
}
</script>

<style scoped>
.preview
{
	overflow: scroll;
}
.canvas
{
	
}
</style>