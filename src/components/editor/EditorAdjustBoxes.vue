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
	watch:
	{
		boxes(value)
		{
			const ctx = this.$refs.canvas.getContext('2d');
			ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
			ctx.strokeStyle = "rgb(255,0,0)";
			for(const box of value)
			{
				const width = box.bbox.x1 - box.bbox.x0;
				const height = box.bbox.y1 - box.bbox.y0;
				ctx.strokeRect(box.bbox.x0, box.bbox.y0, width, height);
			}
		}
	}
}
</script>