<template>
<div :class="['editor', getEditorClasses]" :style="getEditorStyle" ref="editor" @mousedown.left.prevent.stop="onLeftDown" @mouseup.left.prevent.stop="onLeftUp" @mousemove.prevent.stop="onMove" @mouseleave.prevent.stop="onLeave" @wheel.prevent.stop="onWheel">
	<template v-if="isSource">
		<svg class="svg" :style="getSvgStyle">
			<editor-metrics-highlight :offset="offset" :size="editorSize" :metrics="this.scaled"></editor-metrics-highlight>
		</svg>
		<div class="image-window">
			<img class="image-source" :style="getImageStyle" :src="this.current.url">
		</div>
	</template>
</div>
</template>

<script>
import EditorBase from './mixins/EditorBase';
import EditorScale from './mixins/EditorScale';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {updateMetrics} from './mixins/EditorBase';
import {setHover} from '../store/ui';
import {isMatch} from '../lib/isMatch';

const blueprint = 
{
	offset: { top: 12, right: 12, bottom: 12, left: 12 },
}

export default
{
	mixins: [ EditorBase, EditorScale],
	components: { EditorMetricsHighlight },
	props:
	{
		offset: { type: Object, default: blueprint.offset, validator(value){ return isMatch(blueprint.offset, value); } },
	},
	data()
	{
		return {
			mounted: false,
			hover: null,
			active: null,
		}
	},
	computed:
	{
		getEditorClasses()
		{
			const isGrab = this.hover ? 'cursor-grab' : '';
			const isGrabbing = this.active ? 'cursor-grabbing' : '';
			return [isGrab, isGrabbing];
		},
		getEditorStyle()
		{
			if(this.mounted == false) return {};
			return { width: `${this.editorSize.width}px`, height: `${this.editorSize.height}px` };
		},
		getSvgStyle()
		{
			const top = this.offset.top * -1;
			const left = this.offset.left * -1;
			const width = this.editorSize.width + this.offset.left + this.offset.right;
			const height = this.editorSize.height + this.offset.top + this.offset.bottom;
			return { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` };
		},
		getImageStyle()
		{
			return { transform: `rotate(${this.scaled.rotate.value}deg)` };
		},
		editorSize()
		{
			const width = this.current.size.width * this.scale.x;
			const height = this.current.size.height * this.scale.y;
			return { width: width, height: height };
		}
	},
	watch:
	{
		hover(metric)
		{
			const name = (metric === null) ? null : metric.name;
			this.$store.dispatch(setHover, name);
		}
	},
	mounted()
	{
		this.viewport = {width: this.$refs.editor.clientWidth, height: this.$refs.editor.clientHeight };
		this.mounted = true;
	},
	methods:
	{
		initLocal()
		{
			//this.scaled.lines = [this.scaled.x1, this.scaled.x2, this.scaled.y1, this.scaled.y2];
		},
		updateMetrics()
		{
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.scaled.x1.value / this.scale;
					metrics.x2.value = this.scaled.x2.value / this.scale;
					metrics.y1.value = this.scaled.y1.value / this.scale;
					metrics.y2.value = this.scaled.y2.value / this.scale;
					metrics.rotate.value = this.scaled.rotate.value;
			this.$emit(updateMetrics, metrics);
		},
		isHover(metric)
		{
			return this.hover === metric;
		}
	}
}
</script>

<style scoped>
.editor
{
	position:relative;
}
.svg
{
	position: absolute;
	z-index: 1;
}
.image-window
{
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 0;
	overflow: hidden;
}
.image-source
{
	width: 100%;
	height: 100%;
}
</style>