<template>
<div class="editor">
	<template v-if="isOcrNotNull">
		<editor-results-status class="status" :ocr="ocr" />
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

<style lang="scss" scoped>
.editor
{
	@include editor;
}
.status
{
	@include status-top;
}
.desktop
{
	height: 100%;
	overflow: auto;
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