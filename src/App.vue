<template>
	<header-part @files="onFiles"></header-part>
	<list-part :list="list" @current="onCurrent"></list-part>
	<main-part :current="current" :lines="lines"></main-part>
	<footer-part></footer-part>
</template>

<script>
import HeaderPart from './components/HeaderPart.vue';
import ListPart from './components/ListPart.vue';
import MainPart from './components/MainPart.vue';
import FooterPart from './components/FooterPart.vue';

export default 
{
	components: { HeaderPart, ListPart, MainPart, FooterPart },
	name: 'App',
	data()
	{
		return{
			list: [],
			lines: [
				{name: 'x1', type: 'vertical', value: 0 },
				{name: 'x2', type: 'vertical', value: 0 },
				{name: 'y1', type: 'horizontal', value: 0 },
				{name: 'y2', type: 'horizontal', value: 0 },
				{name: 'rotate', type: 'input', value: 0 },
			],
			current: null,
		}
	},
	methods:
	{
		onFiles(files)
		{
			let list = [];
			for(const file of files)
			{
				list.push({name: file.name, src: URL.createObjectURL(file)});
			}
			this.list = list;
		},
		onCurrent(index)
		{
			this.current = this.list[index];
		}
	}
}
</script>

<style>
:root
{
	--font: 'Arial';
	--gray: rgba(200,200,200,1);
	--gray-light: rgba(220,220,220,1);
}
html
{
	height: 100%;
	max-height: 100%;
}
body
{
	height: 100%;
	max-height: 100%;
	padding: 0px;
	margin: 0px;
}
#app
{
	display: flex;
	flex-flow: column nowrap;
	height: 100%;
	max-height: 100%;
	overflow-y: none;
}
input
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
button
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
</style>
