<template>
<div :class="['preview']">
	<canvas ref="canvas"></canvas>
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
	watch:
	{
		source: 'paint',
		metrics: 'paint'
	},
	methods:
	{
		paint()
		{
			//var source = this.$store.getters.source;
			var metrics = this.$store.getters.metrics;
			//console.log('process file', value.url);
			
			let width = metrics.x2.value - metrics.x1.value;
			let height = metrics.y2.value - metrics.y1.value;
			
			this.$refs.canvas.width = width;
			this.$refs.canvas.height = height;
			
			let context = this.$refs.canvas.getContext('2d');
			context.fillStyle = 'rgba(0, 0, 0, .3)';
			context.fillRect(0, 0, width, height);
			
			//console.log(this.source);
			
			context.drawImage(this.source.img, metrics.x1.value, metrics.y1.value, width, height, 0, 0, width, height);
		}
	}
}
</script>

<style scoped>
.preview
{
	height: 100%;
	user-select: none;
	display:flex;
	justify-content: center;
	align-items: center;
	background: red;
}
</style>