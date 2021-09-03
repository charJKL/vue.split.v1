<template>
<section class="list">
	<div v-for="(image, index) in list" :key="image.name" class="thumbnail" :class="isCurrent(image.name)" @click="selectCurrent(image.name, index)">
		<img :src="image.src" />
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
</style>
