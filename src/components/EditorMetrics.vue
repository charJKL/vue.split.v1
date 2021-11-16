<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onLeftDown" @mouseup.left.prevent.stop="onLeftUp" @mousemove.prevent.stop="onMove" @mouseleave.prevent.stop="onLeave" @wheel.prevent.stop="onWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isSource">
		<div class="window" ref="window">
			<img class="image" ref="image" :style="getImageStyle" :src="this.current.url" />
		</div>
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<editor-metrics-highlight :size="highlightSize" :spot="highlightSpot"></editor-metrics-highlight>
			<editor-metrics-line v-for="metric in scaled.lines" :key="metric.name" :type="metric.subtype" :value="metric.value" :hover="isHover(metric)"></editor-metrics-line>
		</svg>
	</div>
</div>
</template>

<script>
import EditorBase from './mixins/EditorBase';
import EditorOffset from './mixins/EditorOffset';
import EditorScale from './mixins/EditorScale';
import EditorMetricsMouse from './EditorMetricsMouse';
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {updateMetrics} from './mixins/EditorBase';
import {setHover} from '../store/ui';
import {isMatch} from '../lib/isMatch';

const blueprint = 
{
	padding: { top: 12, right: 12, bottom: 12, left: 12 },
}

export default
{
	mixins: [ EditorBase, EditorOffset, EditorScale, EditorMetricsMouse ],
	components: { EditorMetricsLine, EditorMetricsHighlight },
	props:
	{
		padding: { type: Object, default: blueprint.padding, validator(value){ return isMatch(blueprint.padding, value); } },
	},
	data()
	{
		return {
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
		getDesktopStyle()
		{
			return { width: `${this.desktopSize.width}px`, height: `${this.desktopSize.height}px` };
		},
		getImageStyle()
		{
			return { transform: `rotate(${this.scaled.rotate.value}deg)` };
		},
		getCanvasStyle()
		{
			return { width: `${this.canvasSize.width}px`, height: `${this.canvasSize.height}px`, left: `-${this.padding.left}px`, top: `-${this.padding.top}px` };
		},
		desktopSize()
		{
			const width = Math.floor(this.current.size.width * this.scale);
			const height = Math.floor(this.current.size.height * this.scale);
			return { width: width, height: height };
		},
		canvasSize()
		{
			const width = this.desktopSize.width + this.padding.left + this.padding.right;
			const height = this.desktopSize.height + this.padding.top + this.padding.bottom;
			return { width: width, height: height };
		},
		highlightSpot()
		{
			const width = this.scaled.x2.value - this.scaled.x1.value;
			const height = this.scaled.y2.value - this.scaled.y1.value;
			return { x: this.scaled.x1.value, y: this.scaled.y1.value, width: width, height: height };
		},
		highlightSize()
		{
			return { width: this.desktopSize.width, height: this.desktopSize.height, x: this.padding.left, y: this.padding.top };
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
		this.viewport = this.$refs.editor.getBoundingClientRect();
		this.margin = { top: 15, right: 15, bottom: 15, left: 15 };
	},
	methods:
	{
		initLocal()
		{
			this.scaled.lines = [this.scaled.x1, this.scaled.x2, this.scaled.y1, this.scaled.y2];
		},
		updateRotation()
		{
			this.calcOffset(this.current.size, this.scaled.rotate.value);
		},
		updateMetrics()
		{
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.scaled.x1.value / this.scale - this.offset.x;
					metrics.x2.value = this.scaled.x2.value / this.scale - this.offset.x;
					metrics.y1.value = this.scaled.y1.value / this.scale - this.offset.y;
					metrics.y2.value = this.scaled.y2.value / this.scale - this.offset.y;
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
	height: 100%;
	user-select: none;
	display:flex;
	justify-content: center;
	align-items: center;
}
.editor.cursor-grab{ cursor: grab; }
.editor.cursor-grabbing{ cursor: grabbing; }
.desktop
{
	position: relative;
	border: solid 1px #000;
}
.window
{
	position: absolute;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.image
{
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
}
.canvas
{
	position: absolute;
	z-index: 2;
}
</style>