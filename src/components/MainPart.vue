<template>
<main ref="main">
	<article :style="style">
		<img ref="image" class="image" :style="style" v-if="current" :src="current.src"  />
		<the-line v-for="(line, index) in lines" :key="index" :type="line.type" v-model:value="line.value"></the-line>
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
		return{
			style: { width: 100 }
		}
	},
	watch:
	{
		current()
		{
			console.log(this.$refs);
			console.log(this.image);
			const preview = this.$refs.main.getBoundingClientRect();
			const image = {width: this.$refs.image.naturalWidth, height: this.$refs.image.naturalHeight };
			const scale = image.height / preview.height;
			
			
			console.log(preview, image, scale);
			
			
			const width = 500;
			const height = 600;
			
			this.style = { width: width+'px', height: height+'px' };
		}
	},
	computed:
	{

	},
	methods: 
	{
		
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
