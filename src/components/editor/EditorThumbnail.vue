<template>
	<template v-if="isSourceDirty">
		<div :class="getEditorClass" v-bind="$attrs">
			<img class="placeholder" src="../../assets/placeholder.svg" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
	<template v-if="isSourceLoading">
		<div :class="getEditorClass" v-bind="$attrs">
			<img class="waiting" src="../../assets/waiting.svg" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
	<template v-if="isSourceCompleted">
		<div :class="getEditorClass" :style="getEditorStyle" v-bind="$attrs">
			<EditorThumbnailStatuses class="statuses" :source="source" :metrics="metrics" :cropped="cropped" :ocr="ocr" :features="features"/>
			<img class="image" :style="getImageStyle" :src="getImageUrl" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
</template>

<script>
import RequireSource from './mixins/RequireSource';
import RequireMetrics from './mixins/RequireMetrics';
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';
import RequireFeatures from './mixins/RequireFeatures';
import ProvideScale from './mixins/ProvideScale';
import EditorThumbnailStatuses from './EditorThumbnailStatuses';
import {mapGetters} from 'vuex';

export default
{
	mixins: [RequireSource, RequireMetrics, RequireCropped, RequireOcr, RequireFeatures, ProvideScale],
	components: {EditorThumbnailStatuses},
	computed:
	{
		...mapGetters(['record']),
		getEditorClass()
		{
			const isSelected = this.record?.source === this.source ? 'selected' : '';
			return ['editor', isSelected];
		},
		getEditorStyle()
		{
			const width = this.scaled.width;
			const height = this.scaled.height;
			return { width: `${width}px`, height: `${height}px` };
		},
		getImageStyle()
		{
			const width = Math.ceil(this.scaled.width);
			const height = Math.ceil(this.scaled.height);
			const rotate = this.metrics.rotate;
			return { width: `${width}px`, height: `${height}px`, transform: `rotate(${rotate}deg)` };
		},
		getName()
		{
			return this.source.filename;
		},
		getImageUrl()
		{
			return this.source.url;
		}
	},
	watch:
	{
		source(source)
		{
			if(this.isSourceDone === false) return;
			const viewport = { width: Infinity, height: 96 };
			const size = { width: source.width, height: source.height };
			this.scale = this.calcRatioScaleValue(viewport, size);
		}
	}
}
</script>

<style scoped>
.editor
{
	position: relative;
	flex: 0 0 130px;
	height: 96px;
	margin: 5px 3px;
	cursor: pointer;
	border: solid 2px #000;
	overflow: hidden;
}
.editor:first-child{margin-left: 5px;}
.editor.selected { border: solid 2px rgba(255, 0, 0, 1); }
.editor.found { outline: dashed 2px rgba(255, 0, 0, 1); }
.editor:not(.selected):hover { border: solid 2px rgba(210, 0, 0, 1); }
.placeholder
{
	position: absolute;
	top: 14px;
	left: 20px;
	width: 90px;
	height: 70px;
}
.waiting
{
	position: absolute;
	width: 30px;
	height: 30px;
	left: 50px;
	top: 30px;
}

.image
{
	position:absolute;
	object-fit: cover;
	z-index: 1;
}
.statuses
{
	position: absolute;
	left: 0px; bottom: 20px;
	width: 100%;
	z-index: 3;
}
.name
{
	position: absolute;
	width: 100%;
	left: 0px; bottom: 0px;
	text-align: center;
	font: 11px / 20px var(--font);
	background: rgba(0, 0, 0, .6);
	color: #fff;
	z-index: 3;
}
.name > :deep(span){ background: rgb(0, 110, 200); }
</style>