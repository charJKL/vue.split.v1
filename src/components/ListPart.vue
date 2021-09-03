<template>
<section ref="list" class="list" @wheel.prevent="onMouseWheel">
	<div v-for="(image, index) in list" :key="image.name" class="thumbnail" :class="isCurrent(image.name)" @click="selectCurrent(image.name, index)">
		<img class="thumbnail-image" :src="image.src" />
		<div class="thumbnail-overflow"></div>
		<div class="thumbnail-marked" v-if="image.metrics.layout.value" >◯</div>
		<div class="thumbnail-check" v-if="image.wasEdited" >✓</div>
		<div class="thumbnail-name">{{ image.name }}</div> 
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
		},
		onMouseWheel(e)
		{
			this.$refs.list.scrollLeft += e.deltaY;
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
	height: 96px;
	margin: 0px 5px;
	cursor: pointer;
	border: solid 2px #000;
}
.thumbnail-image
{
	height: 100%;
	object-fit: cover;
	z-index: 1;
}
.thumbnail-overflow
{
	position: absolute;
	top:0px; left: 0px;
	width: 100%; height: 100%;
	z-index: 2;
}
.thumbnail:hover .thumbnail-overflow{ background: rgba(0, 0, 255, .3); }
.thumbnail.current .thumbnail-overflow{ background: rgba(255, 0, 0, .3); }
.thumbnail-marked
{
	position: absolute;
	width: 100%; height: 100%;
	left: 0px; top: 0px;
	text-align: center;
	font: bold 35px / 100px var(--font);
	color: #f00;
	z-index: 3;
}
.thumbnail-check
{
	position: absolute;
	width: 100%; height: 100%;
	left: 0px; top: 0px;
	text-align: center;
	font: 50px / 100px var(--font);
	color: #0d0;
	z-index: 4;
}
.thumbnail-name
{
	position: absolute;
	width: 100%;
	left: 0px; bottom: 0px;
	text-align: center;
	font: 11px / 20px var(--font);
	background: rgba(0, 0, 0, .6);
	color: #fff;
	z-index: 5;
}
</style>
