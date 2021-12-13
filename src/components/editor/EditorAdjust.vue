<template>
<div class="editor">
	<div class="toolbar">
		<label class="tool scale">🔍 {{ printScaleValue }}</label>
	</div>
	<template v-if="isCroppedNotNull">
		<editor-adjust-status class="status" :cropped="cropped" :ocr="ocr"/>
		<div class="desktop" :style="getDesktopStyle">
			<img class="image" :src="getCroppedUrl" />
			<editor-adjust-boxes class="boxes" :width="cropped.width" :height="cropped.height" :boxes="ocr.words" />
			<editor-adjust-marks class="marks" />
		</div>
	</template>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';
import EditorAdjustStatus from './EditorAdjustStatus';
import EditorAdjustBoxes from './EditorAdjustBoxes';
import EditorAdjustMarks from './EditorAdjustMarks';

export default
{
	mixins: [RequireCropped, RequireOcr, ProvideScale, ProvidePosition],
	components: { EditorAdjustStatus, EditorAdjustBoxes, EditorAdjustMarks },
	computed:
	{
		getDesktopStyle()
		{
			const width = this.cropped.width * this.scale.x;
			const height = this.cropped.height * this.scale.y;
			const left = this.position.x;
			const top = this.position.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		}
	}
}
</script>

<style  lang="scss" scoped>
.editor
{
	@include editor;
}
.toolbar
{
	@include toolbar;
}
.status
{
	@include status-top;
}
.desktop
{
	@include desktop;
}
.image
{
	@include layer;
	z-index: 0;
}
.boxes
{
	@include layer;
	z-index: 1;
}
.marks
{
	@include layer;
	z-index: 2;
}
</style>