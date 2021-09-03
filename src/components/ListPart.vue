<template>
<section class="list">
	<div v-for="(image, index) in list" :key="image.name" class="thumbnail" :class="isCurrent(image.name)" @click="selectCurrent(image.name, index)">
		<img :src="image.src" />
		<div v-if="image.wasEdited" class="check">✓</div>
		<div v-if="image.metrics.layout.value" class="marked">◯</div>
		<div class="name">{{ image.name }}</div> 
	</div>
</section>
</template>

<script>
export default
{
	props:
	{
		list: { type: Object, requred: true },
	},
	data()
	{
		return {
			current: null,
		}
	},
	methods:
	{
		isCurrent(name)
		{
			return this.current === name ? 'current' : '';
		},
		selectCurrent(name, index)
		{
			this.current = name;
			this.$emit('current', index);
		}
	}
}
</script>

<style>
.list
{
	flex: 0 0 auto;
	display: flex;
	flex-flow: row nowrap;
	overflow-x: scroll;
	padding: 10px;
	height: 117px;
	background: var(--gray-light);
}
.thumbnail
{
	position: relative;
	box-sizing: border-box;
	height: 100px;
	margin: 0px 5px;
	border: solid 2px #000;
}
.thumbnail:hover
{
	border: solid 2px #00f;
	cursor:pointer;
}
.thumbnail.current
{
	border: solid 2px #f00;
}
.thumbnail > img
{
	height: 100%;
	object-fit: cover;
}
.check
{
	position: absolute;
	width: 100%;
	left: 0px; top: 25px;
	text-align: center;
	font: 50px / 50px var(--font);
	color: #0d0;
	z-index: 2;
}
.marked
{
	position: absolute;
	width: 100%;
	left: 0px; top: 25px;
	text-align: center;
	font: 40px / 40px var(--font);
	color: #f00;
	z-index: 1;
}
.name
{
	position: absolute;
	width: 100%;
	left: 0px; bottom: 0px;
	text-align: center;
	font: 11px / 20px var(--font);
	background: rgba(0, 0, 0, .5);
	color: #fff;
}
</style>
