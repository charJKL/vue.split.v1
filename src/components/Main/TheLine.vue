<template>
<div class="line" :class="[type, {'moving': isMoving}]" :style="getStyle" @mousedown.left.stop.prevent="onMouseDown">
	<span>{{ name }}</span>
	<hr />
</div>
</template>

<script>
export default 
{
	props:
	{
		value: { type: Number, requred: true },
		type: { type: String, requred: true },
		name: { type: String },
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
	watch:
	{
		isMoving(value)
		{
			if(value === true) document.body.classList.add('moving');
			if(value === false) document.body.classList.remove('moving');
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

<style>
.moving
{
	cursor: grabbing !important;
}
.line
{
	position: absolute;
	cursor: grab;
}
.line span
{
	position: absolute;
	font-size: 11px;
}
.line hr
{
	padding: 0px;
	margin: 0px;
}
.line:hover hr
{
	border: dashed .5px #00f;
}
.line.moving hr
{
	border: dashed .5px #f00;
}
.vertical
{
	height: calc(100% + 10px);
	top: -5px;
	transform: translate(-5px, 0);
	padding: 0px 10px;
}
.vertical hr
{
	border: dashed 1px #000;
	height: 100%;
}
.vertical span
{
	top: 6px;
	left: 15px;
}
.horizontal
{
	width: calc(100% + 10px);
	left: -5px;
	transform: translate(0, -5px);
	padding: 10px 0px;
}
.horizontal hr
{
	border: dashed 1px #000;
	width: 100%;
}
.horizontal span
{
	bottom: 14px;
	right: -10px;
	text-align: left;
}
</style>
