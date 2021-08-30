<template>
<header>
	<div>
		<input type="file" multiple @change="onChange"/>
	</div>
</header>
</template>

<script>
export default
{
	methods: 
	{
		onChange(e)
		{
			console.log('emit?');
			this.$emit('files', e.target.files);
		}
	}
}
</script>

<style>
header
{
	flex: 0 0 content;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
</style>