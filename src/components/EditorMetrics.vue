<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onLeftDown" @mouseup.left.prevent.stop="onLeftUp" @mousemove.prevent.stop="onMove" @mouseleave.prevent.stop="onLeave" @wheel.prevent.stop="onWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
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
	mixins: [EditorMixin, EditorMetricsMouse],
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
			this.calcCurrent(source);
		},
		metrics(metrics)
		{
			if(this.isMetricsNull === true) return;
			this.calcLocal(metrics);
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
		initCurrent()
		{
			this.calcScale(this.current);
			this.calcShift(this.current.size, this.local.rotate.value);
		},
		initLocal()
		{
			this.local.lines = [this.local.x1, this.local.x2, this.local.y1, this.local.y2];
			
			// Transform values into scale:
			this.local.x1.value = this.removeShiftAndScale(this.local.x1.subtype, this.local.x1.value, this.scale);
			this.local.x2.value = this.removeShiftAndScale(this.local.x2.subtype, this.local.x2.value, this.scale);
			this.local.y1.value = this.removeShiftAndScale(this.local.y1.subtype, this.local.y1.value, this.scale);
			this.local.y2.value = this.removeShiftAndScale(this.local.y2.subtype, this.local.y2.value, this.scale);
		},
		calcCurrent(source)
		{
			this.current.filename = source.filename;
			this.current.url = source.url;
			this.current.size.width = source.size.width;
			this.current.size.height = source.size.height;
		},
		calcLocal(metrics)
		{
			this.local.x1.value = this.removeShiftAndScale(metrics.x1.subtype, metrics.x1.value, this.scale);
			this.local.x2.value = this.removeShiftAndScale(metrics.x2.subtype, metrics.x2.value, this.scale);
			this.local.y1.value = this.removeShiftAndScale(metrics.y1.subtype, metrics.y1.value, this.scale);
			this.local.y2.value = this.removeShiftAndScale(metrics.y2.subtype, metrics.y2.value, this.scale);
			this.local.rotate.value = metrics.rotate.value;
		},
		updateMetrics()
		{
			this.calcShift(this.current.size, this.local.rotate.value);
			const metrics = this.getMetricsInstance();
					metrics.x1.value = this.addShiftAndUnscale(this.local.x1.subtype, this.local.x1.value, this.scale);
					metrics.x2.value = this.addShiftAndUnscale(this.local.x2.subtype, this.local.x2.value, this.scale);
					metrics.y1.value = this.addShiftAndUnscale(this.local.y1.subtype, this.local.y1.value, this.scale);
					metrics.y2.value = this.addShiftAndUnscale(this.local.y2.subtype, this.local.y2.value, this.scale);
					metrics.rotate.value = this.local.rotate.value;
			this.$emit(updateMetrics, metrics);
			// this.$store.dispatch(updateMetrics, update);
		},
		calcScale(current)
		{
			const width = this.editor.width - this.margin.left - this.margin.right;
			const height = this.editor.height - this.margin.top - this.margin.bottom;
			const x = width / current.size.width;
			const y= height / current.size.height;
			this.scale = Math.min(x, y);
		},
		calcShift(size, rotate)
		{
			const radians = rotate * Math.PI / 180;
			let x = size.width / 2;
			let y = size.height / 2;
			let nx = x * Math.cos(radians) + y * Math.sin(radians);
			let ny = x * Math.sin(radians) + y * Math.cos(radians);
			this.shift.x = Math.abs(x - nx);
			this.shift.y = Math.abs(y - ny);
		},
		addShiftAndUnscale(subtype, value, scale)
		{
			// first remove scale then add offset
			return this.addShift(subtype, value / scale);
		},
		removeShiftAndScale(subtype, value, scale)
		{
			// first remove shift then scale
			return this.removeShift(subtype, value) * scale;
		},
		addShift(subtype, value)
		{
			if(subtype === 'vertical') return value + this.shift.x;
			if(subtype === 'horizontal') return value + this.shift.y;
			return value;
		},
		removeShift(subtype, value)
		{
			if(subtype === 'vertical') return value - this.shift.x;
			if(subtype === 'horizontal') return value - this.shift.y;
			return value;
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
	},
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