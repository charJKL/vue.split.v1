<template>
<main ref="main">
	<article class="preview" v-if="current" :style="getPreviewStyle" @wheel.prevent="onMouseWhell">
		<div class="desktop">
			<img class="image" :style="getImageStyle" :src="current.src" />
		</div>
		<template v-for="(metric, key, index) in current.metrics" :key="index">
			<the-line v-if="isLine(metric.type)" :type="metric.type" :name="key" :value="metric.value" @update:value="onValueChanged(key, $event)" ></the-line>
		</template>
	</article>
</main>
</template>

<script>
import TheLine from './main/TheLine';

export default
{
	components: { TheLine },
	props:
	{
		current: { type: Object, requred: true },
	},
	data()
	{
		return {
			main: null,
			width: 0,
			height: 0,
			rotate: 0,
		}
	},
	mounted()
	{
		const rect = this.$refs.main.getBoundingClientRect();
				rect.height = rect.height - 20;
		this.main = rect;
	},
	watch:
	{
		current(value)
		{
			const image = new Image();
					image.onload = (e) => this.onImageLoad.call(this, e);
					image.src = value.src;
		}
	},
	computed:
	{
		getPreviewStyle()
		{
			return { width: `${this.width}px`, height: `${this.height}px` }
		},
		getImageStyle()
		{
			return { width: `${this.width}px`, height: `${this.height}px`, transform: `rotate(${this.rotate}deg)` }
		}
	},
	methods: 
	{
		isLine(type)
		{
			return ['vertical','horizontal'].includes(type);
		},
		onImageLoad(e)
		{
			const size = { width: e.target.naturalWidth, height: e.target.naturalHeight };
			const scale = this.main.height / size.height;
			this.width = size.width * scale;
			this.height = size.height * scale;
			this.rotate = this.current.metrics.rotate.value;
		},
		onMouseWhell(e)
		{
			const scale = 0.001;
			this.rotate += e.deltaY * scale;
			
			const current = Object.assign({}, this.current);
					current.metrics.rotate.value = this.rotate;
			this.$emit('update:current', current);
		},
		onValueChanged(key, value)
		{
			const current = Object.assign({}, this.current);
					current.metrics[key].value = value;
			this.$emit('update:current', current);
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
