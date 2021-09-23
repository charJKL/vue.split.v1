<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onMouseLeftDown" @mouseup.left.prevent.stop="onMouseLeftUp" @mousemove.prevent.stop="onMouseMove" @wheel.prevent.stop="onMouseWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<div class="window" ref="window">
			<img class="image" ref="image" :style="getImageStyle" :src="this.current.source.url" />
		</div>
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<editor-metrics-highlight :size="highlightSize" :spot="highlightSpot"></editor-metrics-highlight>
			<editor-metrics-line v-for="metric in metrics.lines" :key="metric.name" :type="metric.subtype" :value="metric.position" :hover="metric.isHover"></editor-metrics-line>
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {updateMetrics} from '../store/records';
import {changeHover} from '../store/ui';
import Hover from './EditorMetricsHover';
import {isMatch} from '../core/isMatch';
import {cloneDeep} from 'lodash';
function onDullMouseEvent(){ }

const blueprint = 
{
	margin: { top: 15, right: 15, bottom: 15, left: 15 },
	padding: { top: 12, right: 12, bottom: 12, left: 12 },
}

export default
{
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
			mouse: Hover,
			hover: null,
			active: null,
		}
	},
	computed:
	{
		current()
		{
			return this.$store.getters.getCurrent;
		},
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		},
		metrics()
		{
			return this.isCurrent ? this.decorate(this.$store.getters.getCurrent.metrics) : null;
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
			return { transform: `rotate(${this.metrics.rotate.value}deg)` };
		},
		getCanvasStyle()
		{
			return { width: `${this.canvasSize.width}px`, height: `${this.canvasSize.height}px`, left: `-${this.padding.left}px`, top: `-${this.padding.top}px` };
		},
		desktopSize()
		{
			const width = Math.floor(this.current.source.size.width * this.scale);
			const height = Math.floor(this.current.source.size.height * this.scale);
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
			const width = this.metrics.x2.position - this.metrics.x1.position;
			const height = this.metrics.y2.position - this.metrics.y1.position;
			return { x: this.metrics.x1.position, y: this.metrics.y1.position, width: width, height: height };
		},
		highlightSize()
		{
			return { width: this.desktopSize.width, height: this.desktopSize.height, x: this.padding.left, y: this.padding.top };
		},
		onMouseLeftDown()
		{
			return this.mouse.onLeftDown ? this.mouse.onLeftDown.bind(this) : onDullMouseEvent;
		},
		onMouseLeftUp()
		{
			return this.mouse.onLeftUp ? this.mouse.onLeftUp.bind(this) : onDullMouseEvent;
		},
		onMouseMove()
		{
			return this.mouse.onMove ? this.mouse.onMove.bind(this) : onDullMouseEvent;
		},
		onMouseWheel()
		{
			return this.mouse.onWheel ? this.mouse.onWheel.bind(this) : onDullMouseEvent;
		},
	},
	watch:
	{
		current(value)
		{
			console.log('current changed', value);
			if(value === null) return;
			this.calcScale();
			this.calcShift(this.current.source.size, this.metrics.rotate.value);
		},
		metrics()
		{
			//console.log('watch-metrics', value);
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
		updateMetrics(name, value)
		{
			const update = cloneDeep(this.current.metrics);
			if(name === 'rotate') this.calcShift(this.current.source.size, value);
			update[name].position = value;
			
			console.log(name, value);
			update.x1.value = this.addShiftAndUnscale(update.x1.subtype, update.x1.position, this.scale);
			update.x2.value = this.addShiftAndUnscale(update.x2.subtype, update.x2.position, this.scale);
			update.y1.value = this.addShiftAndUnscale(update.y1.subtype, update.y1.position, this.scale);
			update.y2.value = this.addShiftAndUnscale(update.y2.subtype, update.y2.position, this.scale);
			update.rotate.value = update.rotate.position;
			this.$store.dispatch(updateMetrics, update);
		},
		calcScale()
		{
			const width = this.editor.width - this.margin.left - this.margin.right;
			const height = this.editor.height - this.margin.top - this.margin.bottom;
			const x = width / this.current.source.size.width;
			const y= height / this.current.source.size.height;
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
		decorate(metrics)
		{
			metrics.lines = [metrics.x1, metrics.x2, metrics.y1, metrics.y2];
			metrics.lines.forEach(metric => metric.position = this.removeShiftAndScale(metric.subtype, metric.value, this.scale) );
			metrics.lines.forEach(metric => metric.isHover = this.isHover(metric.name) );
			metrics.rotate.position = metrics.rotate.value;
			return metrics;
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
		isHover(name)
		{
			return this.$store.getters.getHover === name;
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
	flex: 1 0 0;
	display:flex;
	justify-content: center;
	align-items: center;
	user-select: none;
}
.editor.cursor-grab{ cursor: grab; }
.editor.cursor-grabbing{ cursor: grabbing; }
.desktop
{
	position: relative;
	width: 500px;
	height: 500px;
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