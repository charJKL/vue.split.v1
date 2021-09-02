<template>
<main ref="main">
	<article class="preview" v-if="src" :style="getPreviewStyle" @wheel.prevent="onMouseWhell($event), updateRotatePreviewLayout(), onMetricsChanged()">
		<div class="desktop">
			<img class="image" :style="getImageStyle" :src="src" />
		</div>
		<template v-for="(metric, name, index) in values" :key="index">
			<the-line v-if="metric.type === 'line'" :type="metric.subtype" :name="name" v-model:value="metric.value" @update:value="onMetricsChanged" ></the-line>
		</template>
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
		src: { type: String, requred: true},
		metrics: { type: Object, requred: true},
	},
	data()
	{
		return {
			desktop: {width: 0, height: 0},
			preview: {width: 0, height: 0, rotate: 0},
			values: {},
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
			return { width: `${this.preview.width}px`, height: `${this.preview.height}px`, transform: `rotate(${this.preview.rotate}deg)` }
		}
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
		updateRotatePreviewLayout()
		{
			this.preview.rotate = this.values.rotate.value;
		},
		onMouseWhell(e)
		{
			console.log(e);
			this.values.rotate.value += e.deltaY * this.sensitivity;
		},
		onMetricsChanged()
		{
			const metrics = _.cloneDeep(this.values);
			for(let [name, metric] of Object.entries(this.metrics))
			{
				metric.value = metric.type === 'line' ? this.metrics[name].value / this.scale : this.metrics[name].value;
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
</style>
