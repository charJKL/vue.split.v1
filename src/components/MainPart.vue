<template>
<main ref="main">
	<article :style="style">
		<img class="image" :style="style" v-if="current" :src="current.src"  />
		<the-line v-for="(line, index) in lines" :key="index" v-model:value="line.value" :type="line.type" :name="line.name"></the-line>
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
		lines: { type: Array, requred: true },
	},
	data()
	{
		return {
			preview: null,
			style: { width: 0, height: 0 },
		}
	},
	mounted()
	{
		const rect = this.$refs.main.getBoundingClientRect();
				rect.height = rect.height - 20;
		this.preview = rect;
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

	},
	methods: 
	{
		onImageLoad(e)
		{
			const size = { width: e.target.naturalWidth, height: e.target.naturalHeight };
			const scale = this.preview.height / size.height;
			const width = size.width * scale;
			const height = size.height * scale;
			this.style = { width: width+'px', height: height+'px' };
		}
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
article
{
	position: relative;
	border: solid 1px #000;
}
.line
{
	position: absolute;
}
.image
{
}
</style>
