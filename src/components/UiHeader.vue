<template>
<header class="header">
	<div>
		<span>
			<button @click="this.$refs.loadSave.click()">Load save</button>
			<input class="hide-input" ref="loadSave" @change="onLoadSave" type="file" accept=".json" />
		</span>
		<span>
			<button @click="this.$refs.loadFiles.click()">Load files</button>
			<input class="hide-input" ref="loadFiles" @change="onLoadFiles" type="file" accept="image/*" multiple />
			<input class="input-text" type="text" :value="getList" readonly />
		</span>
	</div>
	<div :class="['header-tab', getMetricsPreviewTabClasses]" @click="onMetricsPreviewTab">
		Metrics - Preview
	</div>
	<div :class="['header-tab', getPreviewTextTabClasses]" @click="onPreviewTextTab">
		Preview - Text - Result
	</div>
</header>
</template>

<script>
import {loadSave, loadList} from '../store/records';
import {setTab, tabMetricsPreview, tabPreviewText} from '../store/ui';

export default
{
	computed:
	{
		getMetricsPreviewTabClasses()
		{
			const isActive = this.$store.getters.tab === tabMetricsPreview ? 'tab-active' : '';
			return [isActive];
		},
		getPreviewTextTabClasses()
		{
			const isActive = this.$store.getters.tab === tabPreviewText ? 'tab-active' : '';
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
	box-sizing: border-box;
	flex-flow: row nowrap;
	background: var(--gray);
	height: 40px;
	border-bottom: solid 1px var(--gray-dark);
}
.header-tab
{
	background: var(--gray);
}
.header-tab.tab-active
{
	position: relative;
	top: 1px;
	border: solid 1px var(--gray-dark);
	border-bottom: none;
	background: var(--gray-light);
}

.hide-input
{
	display: none;
}
.input-text
{
	width: 450px;
}
</style>