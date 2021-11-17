<template>
	<ui-header></ui-header>
	<ui-list></ui-list>
	<main id="main">
		<default-values></default-values>	
		<editor-metrics class="editor" :source="source" :metrics="metrics" @update:metrics="onUpdateMetrics"></editor-metrics>
		<preview class="preview" :source="source" :metrics="metrics"></preview>
	</main>
	<ui-footer></ui-footer>
	<a ref="download" style="display:none"/>
</template>

<script>
import UiHeader from './components/UiHeader';
import UiList from './components/UiList';
import DefaultValues from './components/DefaultValues';
import EditorMetrics from './components/EditorMetrics';
import Preview from './components/Preview';
import UiFooter from './components/UiFooter';
import {updateMetrics} from './store/records';
import _ from 'lodash';

export default 
{
	components: { UiHeader, UiList, DefaultValues, EditorMetrics, Preview, UiFooter },
	name: 'App',
	computed:
	{
		isCurrent()
		{
			return this.$store.getters.current !== null;
		},
		source()
		{
			return this.$store.getters.source;
		},
		metrics()
		{
			return this.$store.getters.metrics;
		}
	},
	methods:
	{
		onUpdateMetrics(metrics)
		{
			this.$store.dispatch(updateMetrics, metrics);
		},
		onLoadSave(save)
		{
			function applySavedList(e)
			{
				const data = JSON.parse(e.target.result);
				for(let [object, key] of Object.entries(data))
				{
					if(this.list[key] === undefined) continue;
					this.list[key] = _.mergeWith(this.list[key], object);
				}
			}
			const reader = new FileReader();
					reader.onload = applySavedList.bind(this);
					reader.readAsText(save);
		},
		onCurrentEdited()
		{
			this.current.wasEdited = true;
		},
		onSave()
		{
			/* TODO this function need to be refactored
			const content = JSON.stringify(this.list);
			const blob = new Blob([content], { type: "application/json" });
			
			this.$refs.download.href = URL.createObjectURL(blob);
			this.$refs.download.download = 'metrics.json';
			this.$refs.download.click();
			*/
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
#main
{
	position: relative;
	flex: 1 0 0;
	display: flex;
	flex-flow: row nowrap;
}
.editor
{
	flex: 0 0 70%;
}
.preview
{
	flex: 0 0 30%;
}

button
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
button:last-child{ margin: 0px 0px 0px 5px; }
button:first-child{ margin: 0px 5px 0px 0px; }
.input-text
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
.input-float,
.input-int
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
	width: 100px;
}
.input-checkbox
{
	position: relative;
	top: 3px;
	height: 20px;
	width: 25px;
	margin: 0px;
	padding: 0px;
}
</style>