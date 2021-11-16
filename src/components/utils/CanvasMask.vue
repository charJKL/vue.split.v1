<template>
	<canvas ref="canvas" :width="size.width" :height="size.height"></canvas>
</template>

<script>
import {isMatch} from '../../lib/isMatch';

const blueprint = 
{
	size: {width: 0, height: 0},
	rect: {x: 0, y: 0, width: 0, height: 0},
}

export default
{
	props:
	{
		size: { type: Object, required: true, validator(value){ return isMatch(blueprint.size, value); } },
		spot: { type: Object, required: true, validator(value){ return isMatch(blueprint.rect, value); } },
	},
	data()
	{
		return {
			context: null
		}
	},
	mounted()
	{
		this.context = this.$refs.canvas.getContext('2d');
		this.paint();
	},
	watch:
	{
		spot: {
			immediate: true,
			handler: 'paint'
		}
	},
	methods:
	{
		paint()
		{
			if(this.context == null) return;
			this.context.clearRect(0, 0, this.size.width, this.size.height);
			
			this.context.globalCompositeOperation = 'source-over';
			this.context.fillStyle = 'rgba(0, 0, 0, .3)';
			this.context.fillRect(0, 0, this.size.width, this.size.height);
			
			this.context.globalCompositeOperation = 'destination-out';
			this.context.fillStyle = 'rgba(0, 0, 0, 1)';
			this.context.fillRect(this.spot.x, this.spot.y, this.spot.width, this.spot.height);
		}
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