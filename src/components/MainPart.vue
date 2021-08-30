<template>
<main>
	<article>
		<img v-if="current" :src="current.src" />
		<div><hr /></div>
	</article>
</main>
</template>

<script>
export default
{
	props:
	{
		current: { type: Object, requred: true },
	},
	data()
	{
		return{
			
		}
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
}
article
{
	position: relative;
	margin: 10px 10px;
	border: solid 1px #000;
}
.line
{
	position: absolute;
}
#image
{
	height: 100%;
	width: 100%;
}
</style>
