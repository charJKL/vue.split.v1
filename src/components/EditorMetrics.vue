<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onLeftDown" @mouseup.left.prevent.stop="onLeftUp" @mousemove.prevent.stop="onMove" @mouseleave.prevent.stop="onLeave" @wheel.prevent.stop="onWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isSource">
		<div class="window" ref="window">
			<img class="image" ref="image" :style="getImageStyle" :src="this.current.url" />
		</div>
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<editor-metrics-highlight :size="highlightSize" :spot="highlightSpot"></editor-metrics-highlight>
			<editor-metrics-line v-for="metric in local.lines" :key="metric.name" :type="metric.subtype" :value="metric.value" :hover="isHover(metric)"></editor-metrics-line>
		</svg>
	</div>
</div>
</template>

<script>
import EditorMixin from './mixins/EditorMixin';
import EditorUtils from './mixins/EditorUtils';
import EditorMetricsMouse from './EditorMetricsMouse';
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {updateMetrics} from '../store/records';
import {changeHover} from '../store/ui';
import {isMatch} from '../lib/isMatch';

const blueprint = 
{
	margin: { top: 15, right: 15, bottom: 15, left: 15 },
	padding: { top: 12, right: 12, bottom: 12, left: 12 },
}

export default
{
	mixins: [EditorMixin, EditorUtils, EditorMetricsMouse],
	components: { EditorMetricsLine, EditorMetricsHighlight },
	props:
	{
		margin: { type: Object, default: blueprint.margin, validator(value){ return isMatch(blueprint.margin, value); } },
		padding: { type: Object, default: blueprint.padding, validator(value){ return isMatch(blueprint.padding, value); } },
	},
	data()
	{
		return {
			editor: { width: 0, height: 0 },
			shift: { x: 0, y: 0 },
			scale: 0,
			hover: null,
			active: null,
		}
	},
	computed:
	{
		isCurrent()
		{
			return this.current !== null;
		},
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
			return { transform: `rotate(${this.local.rotate.value}deg)` };
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
			const width = this.local.x2.value - this.local.x1.value;
			const height = this.local.y2.value - this.local.y1.value;
			return { x: this.local.x1.value, y: this.local.y1.value, width: width, height: height };
		},
		highlightSize()
		{
			return { width: this.desktopSize.width, height: this.desktopSize.height, x: this.padding.left, y: this.padding.top };
		}
	},
	watch:
	{
		source(source)
		{
			if(this.isSourceNull === true) return;
			this.transformSourceToCurrent(source);
			this.calcScale();
			this.calcShift();
		},
		metrics(metrics)
		{
			if(this.isMetricsNull === true) return;
			this.transformMetricsToLocal(metrics);
			this.calcShift();
			this.calcLines();
		},
		hover(metric)
		{
			const name = (metric === null) ? null : metric.name;
			this.$store.dispatch(changeHover, name);
		}
	},
	mounted()
	{
		this.editor = this.$refs.editor.getBoundingClientRect();
	},
	methods:
	{
		transformSourceToCurrent(source)
		{
			this.current.filename = source.filename;
			this.current.url = source.url;
			this.current.size.width = source.size.width;
			this.current.size.height = source.size.height;
		},
		transformMetricsToLocal(metrics)
		{
			this.local.x1.value = this.applyShiftAndApplyScale(metrics.x1.subtype, metrics.x1.value, this.scale);
			this.local.x2.value = this.applyShiftAndApplyScale(metrics.x2.subtype, metrics.x2.value, this.scale);
			this.local.y1.value = this.applyShiftAndApplyScale(metrics.y1.subtype, metrics.y1.value, this.scale);
			this.local.y2.value = this.applyShiftAndApplyScale(metrics.y2.subtype, metrics.y2.value, this.scale);
			this.local.rotate.value = metrics.rotate.value;
		},
		updateMetrics()
		{
			this.calcShift(this.current.size, this.local.rotate.value);
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.removeShiftAndRemoveScale(this.local.x1.subtype, this.local.x1.value, this.scale);
					metrics.x2.value = this.removeShiftAndRemoveScale(this.local.x2.subtype, this.local.x2.value, this.scale);
					metrics.y1.value = this.removeShiftAndRemoveScale(this.local.y1.subtype, this.local.y1.value, this.scale);
					metrics.y2.value = this.removeShiftAndRemoveScale(this.local.y2.subtype, this.local.y2.value, this.scale);
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
			// this.$store.dispatch(updateMetrics, update);
		},
		calcScale()
		{
			this.scale = this.calcScaleValue(this.editor, this.margin, this.current.size);
		},
		calcShift()
		{
			this.shift = this.calcShiftValue(this.current.size, this.local.rotate.value);
		},
		calcLines()
		{
			this.local.lines = [this.local.x1, this.local.x2, this.local.y1, this.local.y2];
		},
		applyShiftAndApplyScale(subtype, value, scale)
		{
			// order in which operation are execute is important:
			value = this.applyShift(subtype, value); // first applay shift
			value = value * scale; // then scale
			return value;
		},
		removeShiftAndRemoveScale(subtype, value, scale)
		{
			// order in which operation are executed is important:
			value = value / scale; // first remove scale, upscale value to it's original values
			value = this.removeShift(subtype, value) // then remove shift
			return value;
		},
		applyShift(subtype, value)
		{
			if(subtype === 'vertical') return value - this.shift.x;
			if(subtype === 'horizontal') return value - this.shift.y;
			throw new Error(`Can't apply shift for '${subtype}' subtype.`);
		},
		removeShift(subtype, value)
		{
			if(subtype === 'vertical') return value + this.shift.x;
			if(subtype === 'horizontal') return value + this.shift.y;
			throw new Error(`Can't remove shift for '${subtype}' subtype.`);
		},
		isHover(metric)
		{
			return this.hover === metric;
		},
		resolveMousePosition(x, y)
		{
			const canvas = this.$refs.canvas.getBoundingClientRect();
			return { x: x - canvas.left, y: y - canvas.top };
		},
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