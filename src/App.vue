<template>
	<ui-header></ui-header>
	<ui-list></ui-list>
	<main id="main">
		<div class="box-editor box-editor-metrics" v-show="isMetricsStage">
			<editor-metrics :source="source" :metrics="metrics" @update:metrics="onUpdateMetrics" />
		</div>
		<div class="box-editor box-editor-preview" v-show="isMetricsStage">
			<editor-preview :source="source" :cropped="cropped" />
		</div>
		<div class="box-editor box-editor-adjust" v-show="isTextStage">
			<editor-adjust :cropped="cropped" :ocr="ocr"/>
		</div>
		<div class="box-editor box-editor-results" v-show="isTextStage">
			<editor-results :ocr="ocr" :features="features" @update:features="onUpdateFeatures"/>
		</div>
	</main>
	<ui-footer></ui-footer>
</template>

<script>
import UiHeader from './components/UiHeader';
import UiList from './components/UiList';
import UiFooter from './components/UiFooter';
import EditorMetrics from './components/editor/EditorMetrics';
import EditorPreview from './components/editor/EditorPreview';
import EditorAdjust from './components/editor/EditorAdjust';
import EditorResults from './components/editor/EditorResults';
import {updateMetrics, updateFeatures} from './store/records';
import {Stage} from './store/ui';
import {mapGetters} from 'vuex';

export default 
{
	components: { UiHeader, UiList, EditorMetrics, EditorPreview, UiFooter, EditorAdjust, EditorResults },
	name: 'App',
	data()
	{
		return {
			main: 'metrics-preview'
		}
	},
	computed:
	{
		...mapGetters(['current', 'source', 'metrics', 'cropped', 'ocr', 'features']),
		...mapGetters(['stage']),
		isMetricsStage()
		{
			return this.stage === Stage.Metrics;
		},
		isTextStage()
		{
			return this.stage === Stage.Text;
		}
	},
	created()
	{
		// https://bugzilla.mozilla.org/show_bug.cgi?id=801176
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
			alert("Firefox is not supported");
		}
	},
	methods:
	{
		onUpdateMetrics(metrics)
		{
			this.$store.dispatch(updateMetrics, metrics);
		},
		onUpdateFeatures(features)
		{
			this.$store.dispatch(updateFeatures, features);
		}
	}
}
</script>

<style >
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
}
body
{
	height: 100%;
	padding: 0px;
	margin: 0px;
}
.cursor-moving{ cursor: move; }
.cursor-scale-out{ cursor: zoom-out; }
.cursor-scale-in{ cursor: zoom-in; }
#app
{
	display: flex;
	flex-flow: column nowrap;
	height: 100%;
}
#main
{
	position: relative;
	flex: 1 0 0;
	height: 0px;
	display: flex;
	flex-flow: row nowrap;
}
.box-editor
{
	display: flex;
	justify-content: center;
	align-items: center;
}
.box-editor-metrics
{
	flex: 0 0 70%;
}
.box-editor-preview
{
	flex: 0 0 calc(30% - 1px);
	border-left: dashed 1px #000;
}
.box-editor-adjust
{
	flex: 0 0 calc(40% - 1px);
	border-right: dashed 1px #000;
}
.box-editor-results
{
	flex: 0 0 60%;
}
</style>