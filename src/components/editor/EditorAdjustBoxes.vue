<template>
	<canvas ref="canvas"></canvas>
</template>

<script>
export default
{
	props:
	{
		boxes: { type: Array, required: true },
	},
	data()
	{
		return {
			size: {width:0, height: 0}
		}
	},
	watch:
	{
		boxes(value)
		{
			const ctx = this.$refs.canvas.getContext('2d');
			
			ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
			ctx.strokeStyle = "rgb(255,0,0)";
			for(const box of value)
			{
				const width = box.x1 - box.x0;
				const height = box.y1 - box.y0;
				ctx.strokeRect(box.x0, box.y0, width, height);
			}
		}
	}
}
</script>