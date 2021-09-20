<template>
<div :class="['editor']" ref="editor">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<div class="window" ref="window">
			<img class="image" ref="image" :style="getImageStyle" :src="this.current.source.url" />
		</div>
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<editor-metrics-highlight :size="highlightSize" :spot="highlightSpot"></editor-metrics-highlight>
			<editor-metrics-line v-for="metric in metrics.line" :key="metric.name" :type="metric.subtype" :value="metric.value" :hover="metric.hover"></editor-metrics-line>
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import {isMatch} from '../core/isMatch';
//function onDullMouseEvent(){ }

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
			const width = this.metrics.x2.value - this.metrics.x1.value;
			const height = this.metrics.y2.value - this.metrics.y1.value;
			return { x: this.metrics.x1.value, y: this.metrics.y1.value, width: width, height: height };
		},
		highlightSize()
		{
			return { width: this.desktopSize.width, height: this.desktopSize.height, x: this.padding.left, y: this.padding.top };
		},
	},
	watch:
	{
		current(value)
		{
			console.log('current changed', value);
			if(value === null) return;
			this.calcScale();
		},
		metrics(value)
		{
			console.log('watch-metrics', value);
		}
	},
	mounted()
	{
		this.editor = this.$refs.editor.getBoundingClientRect();
	},
	methods:
	{
		calcScale()
		{
			const width = this.editor.width - this.margin.left - this.margin.right;
			const height = this.editor.height - this.margin.top - this.margin.bottom;
			const x = width / this.current.source.size.width;
			const y= height / this.current.source.size.height;
			this.scale = Math.min(x, y);
		},
		decorate(metrics)
		{
			/*
			for(let metric in metrics)
			{
				//metrics[metric].position = this.removeShift(metrics[metric].subtype, metrics[metric].value);
				//metrics[metric].position = this.stripScaleShift(type, scale, value);
			}
			*/
			metrics.line = [metrics.x1, metrics.x2, metrics.y1, metrics.y2];
			return metrics;
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
		}
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