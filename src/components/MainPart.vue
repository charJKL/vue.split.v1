<template>
<main ref="main">
	<article ref="preview" class="preview" v-if="src" :style="getPreviewStyle" @click.right.prevent.stop="onMouseRightClick($event), onMetricsChanged()" @click.left.prevent.stop="onMouseLeftClick($event), onMetricsChanged()" @wheel.prevent="onMouseWhell($event), onMetricsChanged()">
		<div class="desktop">
			<img class="image" :style="getImageStyle" :src="src" />
			<div v-if="values.layout.value" class="mark" :style="getMarkStyle"></div>
		</div>
		<template v-for="(metric, name, index) in values" :key="index">
			<the-line v-if="metric.type === 'line'" :type="metric.subtype" :name="name" :value="metric.value" @update:value="onValueChanged(name, $event), onMetricsChanged()" ></the-line>
		</template>
		<div class="vertical-line-invalid" :style="getInvalidVerticalLineStyle"></div>
		<div class="horizontal-line-invalid" :style="getInvalidHorizontalLineStyle"></div>
	</article>
</main>
</template>

<script>
import TheLine from './main/TheLine';
import _ from 'lodash';

export default
{
	components: { TheLine },
	props:
	{
		src: { type: String, requred: true },
		metrics: { type: Object, requred: true },
	},
	data()
	{
		return {
			desktop: {width: 0, height: 0},
			preview: {width: 0, height: 0, rotate: 0},
			values: {},
			mark: {top: 0, left: 0},
			sensitivity: 0.001,
			scale: 0,
		}
	},
	mounted()
	{
		const rect = this.$refs.main.getBoundingClientRect();
				rect.height = rect.height - 20; // minus vertical margin
		this.desktop = rect;
	},
	watch:
	{
		src(value)
		{
			const image = new Image();
			image.addEventListener('load', this.updatePreviewLayout.bind(this));
			image.src = value;
		},
		metrics(value)
		{
			this.values = _.cloneDeep(value);
			for(let [name, metric] of Object.entries(this.values))
			{
				metric.value = metric.type === 'line' ? this.metrics[name].value * this.scale : this.metrics[name].value;
			}
		}
	},
	computed:
	{
		getPreviewStyle()
		{
			return { width: `${this.preview.width}px`, height: `${this.preview.height}px` }
		},
		getImageStyle()
		{
			return { width: `${this.preview.width}px`, height: `${this.preview.height}px`, transform: `rotate(${this.values.rotate.value}deg)` }
		},
		getMarkStyle()
		{
			return { top: `${this.mark.top}px`, left: `${this.mark.left}px` };
		},
		getInvalidVerticalLineStyle()
		{
			let left = this.values.x2.value;
			let width = Math.max(0, this.values.x1.value - this.values.x2.value);
			return { left: `${left}px`, width: `${width}px` };
		},
		getInvalidHorizontalLineStyle()
		{
			let top = this.values.y2.value;
			let height = Math.max(0, this.values.y1.value - this.values.y2.value);
			return { top: `${top}px`, height: `${height}px` };
		},
		
	},
	methods: 
	{
		updatePreviewLayout(e)
		{
			const size = { width: e.target.naturalWidth, height: e.target.naturalHeight };
			this.scale = this.desktop.height / size.height;
			this.preview.width = size.width * this.scale;
			this.preview.height = size.height * this.scale;
			this.preview.rotate = 0;
		},
		onMouseWhell(e)
		{
			this.values.rotate.value += e.deltaY * this.sensitivity;
		},
		onMouseRightClick(e)
		{
			const preview = this.$refs.preview.getBoundingClientRect();
			const left = e.clientX - preview.left;
			const top = e.clientY - preview.top;
			
			this.values.layout.value = true;
			this.mark = {left: left, top: top};
		},
		onMouseLeftClick(e)
		{
			if(e.target.classList.contains('line')) return;
			this.values.layout.value = false;
		},
		onValueChanged(name, value)
		{
			this.values[name].value = value;
		},
		onMetricsChanged()
		{
			const metrics = _.cloneDeep(this.values);
			for(let [name, metric] of Object.entries(metrics))
			{
				metric.value = metric.type === 'line' ? metrics[name].value / this.scale : metrics[name].value;
			}
			this.$emit('update:metrics', metrics);
		},
	}
}
</script>

<style>
main
{
	flex: 1 0 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
.preview
{
	position:relative;
	border: solid 1px #000;
}
.desktop
{
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.mark
{
	position: absolute;
	transform: translate(-50%, -50%);
	width: 250px;
	height: 250px;
	z-index: 1;
	border-radius: 50%;
	border: solid 10px rgba(255, 0, 0, .2);
}
.vertical-line-invalid
{
	background: red;
	position:absolute;
	top: 50%;
	height: 5px;
}
.horizontal-line-invalid
{
	background: red;
	position:absolute;
	left: 50%;
	width: 5px;
}
</style>
