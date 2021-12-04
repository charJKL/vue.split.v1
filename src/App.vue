<template>
	<ui-header></ui-header>
	<ui-list></ui-list>
	<main id="main">
		<!-- <ui-blueprint></ui-blueprint> -->
		
		<div class="editor-box" v-show="isMetricsStage">
			<editor-metrics class="editor" :source="source" :metrics="metrics" @update:metrics="onUpdateMetrics" />
		</div>
		<div class="preview-box" v-show="isMetricsStage">
			<editor-preview class="preview" :source="source" :cropped="cropped" />
		</div>
		<div class="box-editor-results" v-show="isTextStage">
			<editor-results :ocr="ocr" class="results"/>
		</div>
	</main>
	<ui-footer></ui-footer>
	<a ref="download" style="display:none"/>
</template>

<script>
/* eslint-disable */
import UiHeader from './components/UiHeader';
import UiList from './components/UiList';
import UiBlueprint from './components/UiBlueprint';
import UiFooter from './components/UiFooter';
import EditorMetrics from './components/editor/EditorMetrics';
import EditorPreview from './components/editor/EditorPreview';
import EditorResults from './components/editor/EditorResults';
import {updateMetrics} from './store/records';
import {Stage} from './store/ui';
import {mapGetters} from 'vuex';
import _ from 'lodash';

export default 
{
	components: { UiHeader, UiList, UiBlueprint, EditorMetrics, EditorPreview, EditorResults, UiFooter },
	name: 'App',
	data()
	{
		return {
			main: 'metrics-preview'
		}
	},
	computed:
	{
		...mapGetters(['current', 'source', 'metrics', 'cropped', 'ocr']),
		...mapGetters(['stage']),
		isMetricsStage()
		{
			return this.stage === Stage.Metrics;
		},
		isTextStage()
		{
			return this.stage === Stage.Text;
		},
		isCurrent()
		{
			return this.current !== null;
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
.preview-box
{
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 calc(30% - 1px);
	border-left: dashed 1px #000;
}
.box-editor-results
{
	display: flex;
	justify-content: center;
	align-items: center;
	flex: 0 0 50%;
}
.preview
{
	width: 100%;
	height: 100%;
}
</style>