<template>
	<ui-header></ui-header>
	<ui-list></ui-list>
	<main id="main">
		<template v-if="isTabMetricsPreview">
			<default-values></default-values>
			<div class="editor-box">
				<editor-metrics class="editor" :source="source" :metrics="metrics" @update:metrics="onUpdateMetrics"></editor-metrics>
			</div>
			<div class="preview-box">
				<preview class="preview" :source="source" :metrics="metrics"></preview>
			</div>
		</template>
		<template v-if="isTabPreviewText">
			<div class="preview-box">
				<preview class="preview" :source="source" :metrics="metrics"></preview>
			</div>
			<div class="text-box">
				<editor-text></editor-text>
			</div>
		</template>
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
import EditorText from './components/EditorText';
import UiFooter from './components/UiFooter';
import {updateMetrics} from './store/records';
import {tabMetricsPreview, tabPreviewText} from './store/ui';
import _ from 'lodash';

export default 
{
	components: { UiHeader, UiList, DefaultValues, EditorMetrics, Preview, EditorText, UiFooter },
	name: 'App',
	data()
	{
		return {
			main: 'metrics-preview'
		}
	},
	computed:
	{
		isTabMetricsPreview()
		{
			return this.$store.getters.tab === tabMetricsPreview;
		},
		isTabPreviewText()
		{
			return this.$store.getters.tab === tabPreviewText;
		},
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
	--gray-dark: rgba(100,100,100,1);
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
.header
{
	flex: 0 0 auto;
}
#main
{
	position: relative;
	flex: 1 0 0;
	display: flex;
	flex-flow: row nowrap;
	width: 100%;
}
.editor-box
{
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 70%;
}
.editor
{
	border: solid 1px #000;
	width: calc(100% - 20px);
	height: calc(100% - 20px);
}
.preview-box
{
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 calc(30% - 1px);
	border-left: dashed 1px #000;
}
.preview
{
	width: 100%;
	height: 100%;
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