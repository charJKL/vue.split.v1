<template>
<div class="editor">
	<template v-if="isOcr">
		<div class="status" v-if="isOcrNotDone">
			<div class="status-text">{{ocr.status}}</div>
		</div>
		<div v-for="(line, i) of ocr.lines" :key="i">
			<input :value="line.text" />
		</div>
	</template>
</div>
</template>

<script>
import RequireOcr from './mixins/RequireOcr';

export default
{
	mixins: [RequireOcr]
}
</script>

<style scoped>
.editor
{
	position: relative;
	width: 100%;
	height: 100%;
	background: red;
}
.status
{
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	background: rgba(0, 0, 0, .2);
}
.status-text
{
	font: bold 25px var(--font);
}
</style>