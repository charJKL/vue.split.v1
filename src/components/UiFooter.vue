<template>
<div class="footer">
	<div class="footer-left">
		<editor-input></editor-input>
	</div>
	<div class="footer-right">
		<button id="save" @click="onSaveData">Save</button>
	</div>
</div>
</template>

<script>
import EditorInput from './EditorInput.vue';

export default
{
	components: { EditorInput },
	methods:
	{
		onSaveData()
		{
			//this.$store.dispath(loadSave, e.target.files[0]);
		}
	}
}
</script>

<style scoped>
.footer
{
	flex: 0 0 auto;
	margin-top: auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
.footer-left
{
	margin-right: auto;
}
.footer-right
{
	margin-left: auto;
}
</style>
