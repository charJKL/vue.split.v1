<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onMouseLeftDown" @mouseup.left.prevent.stop="onMouseLeftUp" @mousemove.prevent.stop="onMouseMove" @wheel.prevent.stop="onMouseWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<img class="image" :style="getImageStyle" :src="getCurrentUrl" />
		<svg class="canvas" :style="getCanvasStyle" ref="canvas">
			<editor-metrics-highlight :area="areaSize" :highlight="highlightSize"></editor-metrics-highlight>
			<editor-metrics-line name="x1" type="vertical" :value="getX1LineValue" :hover="isHover('x1')" />
			<editor-metrics-line name="x2" type="vertical" :value="getX2LineValue" :hover="isHover('x2')" />
			<editor-metrics-line name="y1" type="horizontal" :value="getY1LineValue" :hover="isHover('y1')" />
			<editor-metrics-line name="y2" type="horizontal" :value="getY2LineValue" :hover="isHover('y2')" />
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {updateMetrics} from '../store/records';
import {changeHover} from '../store/ui';
import {isMatch} from '../core/isMatch';
import {cloneDeep} from 'lodash';
import Hover from './EditorMetricsHover';


const blueprint = 
{
	offset: { left: -15, top: -15 },
	padding: { top: 20, left: 20, bottom: 20, right: 20 },
}

function onDullMouseEvent(){ }

export default
{
	components: { EditorMetricsLine, EditorMetricsHighlight },
	props:
	{
		offset: { type: Object, default: blueprint.offset, validator(value){ return isMatch(blueprint.offset, value); } },
		padding: { type: Object, default: blueprint.padding, validator(value){ return isMatch(blueprint.padding, value); } },
	},
	data()
	{
		return {
			editor: { width: 0, height: 0 },
			scale: 0,
			rotate: 0,
			start: { x: 0, y: 0 },
			mouse: Hover,
			hover: null,
			active: null,
		}
	},
	computed:
	{
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		},
		current()
		{
			return this.$store.getters.getCurrent;
		},
		getCurrentUrl()
		{
			return this.current.source.url;
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
			return { transform: `rotate(${this.rotate}deg)` };
		},
		getCanvasStyle()
		{
			return { width: `${this.canvasSize.width}px`, height: `${this.canvasSize.height}px`, left: `${this.offset.left}px`, top: `${this.offset.top}px` };
		},
		getX1LineValue()
		{
			return this.inApplyOffsetScale('x1',this.current.metrics.x1.value);
		},
		getX2LineValue()
		{
			return this.inApplyOffsetScale('x2', this.current.metrics.x2.value);
		},
		getY1LineValue()
		{
			return this.inApplyOffsetScale('y1', this.current.metrics.y1.value);
		},
		getY2LineValue()
		{
			return this.inApplyOffsetScale('y2', this.current.metrics.y2.value);
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
		highlightSize()
		{
			const width = this.getX2LineValue - this.getX1LineValue;
			const height = this.getY2LineValue - this.getY1LineValue;
			return {x: this.getX1LineValue, y: this.getY1LineValue, width: width, height: height };
		},
		areaSize()
		{
			const x = Math.abs(this.offset.top);
			const y = Math.abs(this.offset.left);
			return {x: x, y: y, width: this.desktopSize.width, height: this.desktopSize.height };
		},
		desktopSize()
		{
			const width = Math.floor(this.current.source.size.width * this.scale);
			const height = Math.floor(this.current.source.size.height * this.scale);
			return { width: width, height: height };
		},
		canvasSize()
		{
			const width = this.desktopSize.width + Math.abs(this.offset.left) * 2;
			const height = this.desktopSize.height + Math.abs(this.offset.top) * 2;
			return { width: width, height: height };
		},
	},
	watch:
	{
		hover(value)
		{
			this.$store.dispatch(changeHover, value);
		},
		current(value)
		{
			if(value === null) return;
			this.updateScale();
		},
	},
	mounted()
	{
		this.editor = this.$refs.editor.getBoundingClientRect();
	},
	methods:
	{
		isHover(name)
		{
			return this.$store.getters.getHover === name;
		},
		updateScale()
		{
			const width = this.editor.width - this.padding.left - this.padding.right;
			const height = this.editor.height - this.padding.left - this.padding.right;
			const x = width / this.current.source.size.width;
			const y = height / this.current.source.size.height;
			this.scale = Math.min(x, y);
		},
		inApplyOffsetScale(name, value)
		{
			const scale = (name === 'rotate') ? 1 : this.scale;
			return value * scale;
		},
		outApplyOffsetScale(name, value)
		{
			const scale = (name === 'rotate') ? 1 : this.scale;
			return value / scale;
		},
		updateMetrics(name, value)
		{
			const update = cloneDeep(this.current.metrics);
					update[name].value = this.outApplyOffsetScale(name, value);
			this.$store.dispatch(updateMetrics, update);
		},
		resolvePosition(x, y)
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