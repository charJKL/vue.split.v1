<template>
<header>
	<div>
		<button @click="this.$refs.loadFile.click()">Load file</button>
		<input ref="loadFile" style="display:none" type="file" @change="onLoadFile"/>
		<input type="file" multiple @change="onPickFiles"/>
	</div>
</header>
</template>

<script>
export default
{
	methods: 
	{
		onLoadFile(e)
		{
			this.$emit('load-file', e.target.files[0]);
		},
		onPickFiles(e)
		{
			this.$emit('pick-files', e.target.files);
		}
	}
}
</script>

<style>
header
{
	flex: 0 0 auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
</style>