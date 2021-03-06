<template>
	<div :class="getEditorClass" ref="editor">
		<div class="toolbar">
			<label class="tool scale">🔍 {{ printScaleValue }}</label>
			<label class="tool wasEdited" v-if="isMetricsNotNull"><input type="checkbox" :checked="metrics.wasEdited" @change="onWasEdited" />wasEdited</label>
		</div>
		<template v-if="isSourceNotNull">
			<div class="desktop" :style="getDesktopStyle">
				<svg class="svg" :style="getSvgStyle">
					<editor-metrics-line :offset="offset" type="vertical" :value="scaled.x1" :hover="hover == 'x1'" />
					<editor-metrics-line :offset="offset" type="vertical" :value="scaled.x2" :hover="hover == 'x2'" />
					<editor-metrics-line :offset="offset" type="horizontal" :value="scaled.y1" :hover="hover == 'y1'" />
					<editor-metrics-line :offset="offset" type="horizontal" :value="scaled.y2" :hover="hover == 'y2'" />
				</svg>
				<img class="image" :style="getImageStyle" :src="source.url" />
			</div>
		</template>
	</div>
</template>

<script>
import RequireMetrics, {updateMetrics} from './mixins/RequireMetrics';
import RequireSource from './mixins/RequireSource';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';
import EditorMetricsMouseHover from './EditorMetricsMouseHover';
import EditorMetricsMouseDragging from './EditorMetricsMouseDragging';
import EditorMetricsLine from './EditorMetricsLine';
import {isMatch} from '../../lib/isMatch';

export const offset = { top: 8, right: 8, bottom: 8, left: 8 };

export default
{
	mixins: [RequireMetrics, RequireSource, ProvideScale, ProvidePosition, EditorMetricsMouseHover, EditorMetricsMouseDragging],
	components: { EditorMetricsLine },
	props:
	{
		offset: { type: Object, default: offset, validator(value){ return isMatch(offset, value); } },
	},
	data()
	{
		return {
			viewport: {width: 0, height: 0},
		}
	},
	computed:
	{
		getEditorClass()
		{
			const isHover = this.hover ? 'cursor-hover' : '';
			const isDragging = this.dragging ? 'cursor-dragging' : '';
			return ['editor', isHover, isDragging];
		},
		getImageStyle()
		{
			const width = this.scaled.width - 2;
			const height = this.scaled.height - 2;
			const rotate = this.metrics.rotate;
			return { width: `${width}px`, height: `${height}px`, transform: `rotate(${rotate}deg)` };
		},
		getDesktopStyle()
		{
			const width = this.scaled.width;
			const height = this.scaled.height;
			const left = this.position.x;
			const top = this.position.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		},
		getSvgStyle()
		{
			const top = this.offset.top * -1;
			const left = this.offset.left * -1;
			const width = this.scaled.width + this.offset.left + this.offset.right;
			const height = this.scaled.height + this.offset.top + this.offset.bottom;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		}
	},
	watch:
	{
		source(source)
		{
			if(this.isSourceCompleted === false) return;
			const size = { width: source.width, height: source.height };
			this.scale = this.calcRatioScaleValue(this.viewport, size);
			this.position = this.calcCenterPositionValue(this.viewport, this.scaled);
		}
	},
	methods:
	{
		onWasEdited(e)
		{
			const metrics = {...this.metrics};
			metrics.wasEdited = e.target.checked;
			this.$emit(updateMetrics, metrics);
		}
	},
	mounted()
	{
		this.viewport = {width: this.$refs.editor.clientWidth, height: this.$refs.editor.clientHeight };
	}
}
</script>

<style  lang="scss" scoped>
.editor
{
	@include editor;
}
.toolbar
{
	@include toolbar;
}
.desktop
{
	@include desktop;
}
.svg
{
	@include layer;
	z-index: 1;
}
.image
{
	@include layer;
	z-index: 0;
	border: solid 1px #000;
}
</style>