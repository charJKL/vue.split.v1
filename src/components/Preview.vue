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
			this.temp.width = this.source.size.width;
			this.temp.height = this.source.size.height;
			const tempContext = this.temp.getContext("2d");
			
			const halfX = this.source.size.width / 2;
			const halfY = this.source.size.height / 2;
			
			tempContext.translate(halfX * -1, halfY * -1);
			tempContext.rotate(this.metrics.rotate.value * Math.PI / 180);
			tempContext.drawImage(this.source.img, halfX, halfY);
			
			const width = this.metrics.x2.value - this.metrics.x1.value;
			const height = this.metrics.y2.value - this.metrics.y1.value;
			
			this.canvas.width = width;
			this.canvas.height = height;
			const canvasContext = this.canvas.getContext("2d");
			canvasContext.drawImage(this.temp, this.metrics.x1.value, this.metrics.y1.value, width, height, 0, 0, width, height);
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