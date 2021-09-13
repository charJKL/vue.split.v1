<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onMouseLeftDown" @mouseup.left.prevent.stop="onMouseLeftUp" @mousemove.prevent.stop="onMouseMove">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<img class="image" :src="getCurrentUrl" />
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<editor-metrics-highlight :area="areaSize" :highlight="highlightSize"></editor-metrics-highlight>
			<template v-for="metric in metrics" :key="metric.name">
				<editor-metrics-line v-if="metric.type === 'line'" :type="metric.subtype" :name="metric.name" :value="metric.value" :hover="isHover(metric.name)"/>
			</template>
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {isMatch} from '../core/isMatch';
import {changeHover} from '../store/ui';
import Hover from './EditorMetricsHover';
import Record from './Record';

const blueprint = 
{
	offset: { left: -15, top: -15 },
	padding: { top: 20, left: 20, bottom: 20, right: 20 },
}

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
			metrics: Record.metrics,
			editor: { width: 0, height: 0 },
			scale: 0,
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
		getCanvasStyle()
		{
			return { width: `${this.canvasSize.width}px`, height: `${this.canvasSize.height}px`, left: `${this.offset.left}px`, top: `${this.offset.top}px` };
		},
		firstXLine()
		{
			return Math.min(this.metrics.x1.value, this.metrics.x2.value);
		},
		secondXLine()
		{
			return Math.max(this.metrics.x1.value, this.metrics.x2.value);
		},
		firstYLine()
		{
			return Math.min(this.metrics.y1.value, this.metrics.y2.value);
		},
		secondYLine()
		{
			return Math.max(this.metrics.y1.value, this.metrics.y2.value);
		},
		onMouseLeftDown()
		{
			return this.mouse.onLeftDown ? this.mouse.onLeftDown.bind(this) : new Function();
		},
		onMouseLeftUp()
		{
			return this.mouse.onLeftUp ? this.mouse.onLeftUp.bind(this) : new Function();
		},
		onMouseMove()
		{
			return this.mouse.onMove ? this.mouse.onMove.bind(this) : new Function();
		},
		highlightSize()
		{
			const width = this.secondXLine - this.firstXLine;
			const height = this.secondYLine - this.firstYLine;
			return {x: this.firstXLine, y: this.firstYLine, width: width, height: height };
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
			this.metrics = value.metrics;
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