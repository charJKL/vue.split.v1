<template>
<div class="line" :class="[type, {'moving': isMoving}]" :style="getStyle" @mousedown.left.stop.prevent="onMouseDown">
	<hr />
</div>
</template>

<script>
export default 
{
	props:
	{
		type: { type: String, requred: true },
		value: { type: Number, requred: true }
	},
	data()
	{
		return {
			isMoving: false,
			position: 0,
			point: { x:0, y:0 },
		}
	},
	computed:
	{
		getStyle()
		{
			const attr = this.type === 'vertical' ? 'left' : 'top';
			const value = this.value + 'px';
			return { [attr]: value };
		}
	},
	created()
	{
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
		
	},
	unmounted()
	{
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	},
	methods:
	{
		onMouseDown(e)
		{
			this.point = { x: e.clientX, y: e.clientY };
			this.position = this.value;
			this.isMoving = true;
		},
		onMouseMove(e)
		{
			if(this.isMoving === false) return;
			const point = {x: e.clientX, y: e.clientY };
			const stored = this.type === 'vertical' ? this.point.x : this.point.y;
			const current = this.type === 'vertical' ? point.x : point.y;
			const diff = current - stored;
			this.$emit('update:value', this.position + diff);
		},
		onMouseUp()
		{
			this.isMoving = false;
		},
	}
}
</script>

<style scoped>
.line
{
	position: absolute;
	cursor: grab;
}
.line.moving
{
	cursor: grabbing;
}
.line hr
{
	padding: 0px;
	margin: 0px;
}
.line:hover hr
{
	border: dashed 1px #00f;
}
.line.moving hr
{
	border: dashed 1px #f00;
}
.vertical
{
	--offset: 10px;
	height: calc(100% + var(--offset) * 2);
	top: calc(var(--offset) * -1);
	transform: translate(-10px, 0);
	padding: 0px 10px;
}
.vertical hr
{
	border: dashed 1px #000;
	height: 100%;
}
.horizontal
{
	--offset: 10px;
	width: calc(100% + var(--offset) * 2);
	left: calc(var(--offset) * -1);
	transform: translate(0, -10px);
	padding: 10px 0px;
}
.horizontal hr
{
	border: dashed 1px #000;
	width: 100%;
}
</style>
