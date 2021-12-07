<template>
<div class="editor">
	<template v-if="isOcrNotNull">
		<editor-results-status class="status" :status="ocr.status" :details="ocr.details" />
		<div class="desktop">
			<div class="line" v-for="(line, i) of ocr.lines" :key="i" >
				<input class="line-checkbox" type="checkbox">
				<input class="line-text" :value="line.text" />
			</div>
		</div>
	</template>
</div>
</template>

<script>
import RequireOcr from './mixins/RequireOcr';
import EditorResultsStatus from './EditorResultsStatus';

export default
{
	components: {EditorResultsStatus},
	mixins: [RequireOcr],
}
</script>

<style scoped>
.editor
{
	position: relative;
	width: 100%;
	height: 250px;
	overflow: hidden;
}
.status
{
	display: block;
	position: absolute;
	top: 0px; left: 0px;
	width: 100%;
	height: 100px;
	z-index: 1;
	background: linear-gradient(180deg, rgba(50, 50, 50, .3) 0%, rgba(50, 50, 50, .1) 50%, rgba(50, 50, 50, 0) 100%);
}
.line
{
	display: flex;
	width: 100%;
}
.line-checkbox
{
	margin: 12px 0px 10px 10px;
}
.line-text
{
	width: 100%;
	margin: 3px 10px 3px 3px;
	font: 16px / 24px var(--font);
}
</style>