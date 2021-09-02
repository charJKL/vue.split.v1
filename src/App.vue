<template>
	<header-part @pick-files="onPickFiles" @load-file="onLoadFile"></header-part>
	<list-part :list="list" @current="onCurrent"></list-part>
	<main-part :src="current.src" v-model:metrics="current.metrics"></main-part>
	<footer-part v-model:current="current" @save="onSave"></footer-part>
	<a ref="download" style="display:none"/>
</template>

<script>
import HeaderPart from './components/HeaderPart.vue';
import ListPart from './components/ListPart.vue';
import MainPart from './components/MainPart.vue';
import FooterPart from './components/FooterPart.vue';
import _ from 'lodash';

export default 
{
	components: { HeaderPart, ListPart, MainPart, FooterPart },
	name: 'App',
	data()
	{
		return{
			list: {},
			current: {src: "", metrics: {}},
			metrics: {
				x1: { type: 'line', subtype: 'vertical', value: 0 },
				x2: { type: 'line', subtype: 'vertical', value: 0 },
				y1: { type: 'line', subtype: 'horizontal', value: 0 },
				y2: { type: 'line', subtype: 'horizontal', value: 0 },
				rotate: { type: 'value', value: 0},
			},
		}
	},
	methods:
	{
		onLoadFile(file)
		{
			const reader = new FileReader();
					reader.onload = this.onLoad;
					reader.readAsText(file);
		},
		onPickFiles(files)
		{
			for(const file of files)
			{
				const object = {};
					object.name = file.name;
					object.src = URL.createObjectURL(file);
					object.metrics = _.cloneDeep(this.metrics);
				this.list[file.name] = object;
			}
		},
		onCurrent(index)
		{
			this.current = this.list[index];
		},
		onLoad(e)
		{
			const result = e.target.result;
			const list = JSON.parse(result);
			for(let [name, value] of Object.entries(list))
			{
				if(this.list[name] === undefined) continue;
				this.list[name] = _.mergeWith(this.list[name], value, (v,s,k) => { if(k === 'src') return v; } );
			}
		},
		onSave()
		{
			const content = JSON.stringify(this.list);
			const blob = new Blob([content], { type: "application/json" });
			
			this.$refs.download.href = URL.createObjectURL(blob);
			this.$refs.download.download = 'data.json';
			this.$refs.download.click();
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
