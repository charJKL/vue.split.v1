<template>
<div id="editor" ref="editor">
	<div class="desktop" :style="getDesktopStyle" v-if="isCurrent">
		<img class="image" :src="getCurrentUrl" />
		<svg class="canvas" :style="getCanvasStyle">
			<template v-for="(metric, name) in metrics" :key="name">
				<editor-metrics-line v-if="metric.type === 'line'" :type="metric.subtype" :name="name" :value="metric.value" />
			</template>
			<editor-metrics-highlight :area="areaSize" :highlight="highlightSize"></editor-metrics-highlight>
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import EditorMetricsHighlight from './EditorMetricsHighlight';
import Record from './Record';

//import _ from 'lodash';

export default
{
	components: { EditorMetricsLine, EditorMetricsHighlight },
	data()
	{
		return {
			padding: { top: 40 },
			metrics: Record.metrics,
			editor: { width: 0, height: 0 },
			offset: { left: -15, top: -15 },
			scale: 0,
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
		}
	},
	watch:
	{
		current(value)
		{
			console.log('watch-current', value);
			this.updateScale();
		}
	},
	mounted()
	{
		const rect = this.$refs.editor.getBoundingClientRect();
				rect.height = rect.height - this.padding.top;
		this.editor = rect;
	},
	methods:
	{
		updateScale()
		{
			const x = this.editor.width / this.current.source.size.width;
			const y = this.editor.height / this.current.source.size.height;
			this.scale = Math.min(x, y);
		}
	},
}
</script>

<style scoped>
#editor
{
	flex: 1 0 0;
	display:flex;
	justify-content: center;
	align-items: center;
	background: red;
}
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
	top: 0px; left: 0px;
	z-index: 2;
	width: 0px;
	height: 0px;
}

</style>
