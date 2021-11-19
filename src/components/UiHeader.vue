<template>
<header class="header">
	<button class="load-save" @click="this.$refs.loadSave.click()">Load save</button>
	<input class="input-hide" ref="loadSave" @change="onLoadSave" type="file" accept=".json" />
	
	<button class="load-files" @click="this.$refs.loadFiles.click()">Load files</button>
	<input class="input-hide" ref="loadFiles" @change="onLoadFiles" type="file" accept="image/*" multiple />
	<input class="file-list" type="text" :value="getList" @click="this.$refs.loadFiles.click()" readonly />
	
	<button :class="['metrics-preview', getMetricsPreviewClasses]" @click="onMetricsPreviewTab">Metrics - Preview</button>
	<button :class="['preview-text', getPreviewTextClasses]" @click="onPreviewTextTab">Preview - Text - Result</button>
</header>
</template>

<script>
import {loadSave, loadList} from '../store/records';
import {setTab, tabMetricsPreview, tabPreviewText} from '../store/ui';

export default
{
	computed:
	{
		getMetricsPreviewClasses()
		{
			const isActive = this.$store.getters.tab === tabMetricsPreview ? 'is-active' : '';
			return [isActive];
		},
		getPreviewTextClasses()
		{
			const isActive = this.$store.getters.tab === tabPreviewText ? 'is-active' : '';
			return [isActive];
		},
		getList()
		{
			return this.$store.getters.list.flatMap(file => file.source.filename);
		}
	},
	methods: 
	{
		onLoadSave(e)
		{
			this.$store.dispath(loadSave, e.target.files[0]);
		},
		onLoadFiles(e)
		{
			this.$store.dispatch(loadList, Array.from(e.target.files));
		},
		onMetricsPreviewTab()
		{
			this.$store.dispatch(setTab, tabMetricsPreview);
		},
		onPreviewTextTab()
		{
			this.$store.dispatch(setTab, tabPreviewText);
		}
	}
}
</script>

<style scoped>
.header
{
	display: flex;
	flex-flow: row nowrap;
	background: var(--gray);
}
input
{
	box-sizing: border-box;
	height: 30px;
	margin: 10px 0px 10px 0px;
}
button
{
	box-sizing: border-box;
	height: 30px;
	margin: 10px 0px 10px 0px;
}
.load-save
{
	margin-left: 10px;
}
.load-files
{
	margin-left: 5px;
}
.metrics-preview
{
	margin-left: 50px;
}
.preview-text
{
	margin-left: 5px;
}
.is-active
{
	outline: solid 1px red;
}
.input-hide
{
	display: none;
}
.file-list
{
	width: 350px;
}
</style>