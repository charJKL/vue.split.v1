<template>
	<canvas ref="canvas"></canvas>
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
	},
	watch:
	{
		size(value)
		{
			console.log('mask-watch-size', value);
			this.$refs.canvas.width = value.width;
			this.$refs.canvas.height = value.height;
		},
		spot(value)
		{
			console.log('mask-watch-spot', value);
			//this.context.fillStyle = 'rgba(255, 0, 0, .3)';
			//this.context.fillRect(0, 0, this.size.width, this.size.height);
			
			//this.context.globalCompositeOperation = 'destination-out';
			//this.context.fillStyle = 'rgba(0, 0, 0, 1)';
			//this.context.fillRect(0, 0, 25, 25);
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