<template>
<section>
	<img v-for="(image) in list" :src="image.src" :key="image.name" :class="isCurrent(image.name)" @click="selectCurrent(image.name)"/>
</section>
</template>

<script>
export default
{
	props:
	{
		list: { type: Array, requred: true },
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
		selectCurrent(name)
		{
			this.current = name;
			this.$emit('current', name);
		}
	}
}
</script>

<style>
section
{
	flex: 0 0 content;
	display: flex;
	flex-flow: row nowrap;
	overflow-y: auto;
	padding: 10px;
	background: var(--gray-light);
}
section > img
{
	height: 100px;
	margin: 0px 5px;
	border: solid 2px #000;
}
section > img:hover
{
	border: solid 2px #00f;
	cursor:pointer;
}
section > img.current
{
	border: solid 2px #f00;
}
</style>
