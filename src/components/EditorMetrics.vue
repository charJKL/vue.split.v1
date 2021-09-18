<template>
<div :class="['editor', getEditorClasses]" ref="editor" @mousedown.left.prevent.stop="onMouseLeftDown" @mouseup.left.prevent.stop="onMouseLeftUp" @mousemove.prevent.stop="onMouseMove" @wheel.prevent.stop="onMouseWheel">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<div class="window" ref="window">
			<img class="image" ref="image" :style="getImageStyle" :src="getCurrentUrl" />
		</div>
		<svg class="canvas" :style="getCanvasStyle" ref="canvas">
			<editor-metrics-highlight :area="areaSize" :highlight="highlightSize"></editor-metrics-highlight>
			<editor-metrics-line v-for="metric in [x1,x2,y1,y2]" :key="metric.name" :type="metric.subtype" :value="metric.value" :hover="metric.hover" />
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
import Record from './Record';
import Hover from './EditorMetricsHover';

const blueprint = 
{
	outer: { left: -15, top: -15 },
	padding: { top: 20, left: 20, bottom: 20, right: 20 },
}

function onDullMouseEvent(){ }

function template(name)
{
	const metric = cloneDeep(Record.metrics[name]);
			metric.value =  this.inApplyOffsetScale(name, this.current.metrics[name].value);
			metric.hover = this.isHover(name);
	return metric;
}

export default
{
	components: { EditorMetricsLine, EditorMetricsHighlight },
	props:
	{
		outer: { type: Object, default: blueprint.outer, validator(value){ return isMatch(blueprint.outer, value); } },
		padding: { type: Object, default: blueprint.padding, validator(value){ return isMatch(blueprint.padding, value); } },
	},
	data()
	{
		return {
			editor: { width: 0, height: 0 },
			offset: {x: 0, y: 0},
			scale: 0,
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
			return { transform: `rotate(${this.rotate.value}deg)` };
		},
		getCanvasStyle()
		{
			return { width: `${this.canvasSize.width}px`, height: `${this.canvasSize.height}px`, left: `${this.outer.left}px`, top: `${this.outer.top}px` };
		},
		x1()
		{
			return template.call(this, 'x1');
		},
		x2()
		{
			return template.call(this, 'x2');
		},
		y1()
		{
			return template.call(this, 'y1');
		},
		y2()
		{
			return template.call(this, 'y2');
		},
		rotate()
		{
			return template.call(this, 'rotate');
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
			const width = this.x2.value - this.x1.value;
			const height = this.y2.value - this.y1.value;
			return {x: this.x1.value, y: this.y1.value, width: width, height: height };
		},
		areaSize()
		{
			const x = Math.abs(this.outer.top);
			const y = Math.abs(this.outer.left);
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
			const width = this.desktopSize.width + Math.abs(this.outer.left) * 2;
			const height = this.desktopSize.height + Math.abs(this.outer.top) * 2;
			return { width: width, height: height };
		},
	},
	watch:
	{
		hover(metric)
		{
			const name = (metric === null) ? null : metric.name;
			this.$store.dispatch(changeHover, name);
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
		updateOffset()
		{
			const window = this.$refs.window.getBoundingClientRect();
			const image = this.$refs.image.getBoundingClientRect();
			this.offset.x = Math.abs(image.left - window.left);
			this.offset.y = Math.abs(image.top - window.top);
		},
		inApplyOffsetScale(name, value)
		{
			const scale = (name === 'rotate') ? 1 : this.scale;
			const offsetX = (name === 'x1' || name === 'x2') ? this.offset.x : 0; 
			const offsetY = (name === 'y1' || name === 'y2') ? this.offset.y : 0;
			return (value - offsetX - offsetY) * scale;
		},
		outApplyOffsetScale(name, value)
		{
			const scale = (name === 'rotate') ? 1 : this.scale;
			const offsetX = (name === 'x1' || name === 'x2') ? this.offset.x : 0; 
			const offsetY = (name === 'y1' || name === 'y2') ? this.offset.y : 0;
			return (value + offsetX + offsetY) / scale;
		},
		updateMetrics(name, value)
		{
			const update = cloneDeep(this.current.metrics);
			switch(name)
			{
				case 'x1':
				case 'x2':
				case 'y1':
				case 'y2':
					update[name].value = this.outApplyOffsetScale(name, value);
					break;
					
				case 'rotate':
					this.updateOffset();
					update[name].value = this.outApplyOffsetScale(name, value);
					for(let metric in update)
					{
						if(update[metric].type !== 'line') continue;
						update[metric].value = this.outApplyOffsetScale(update[metric].name, this[metric].value);
					}
					break;
				
				default:
					throw new Error('Metrics name is wrong');
			}
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