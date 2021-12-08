<template>
<div class="editor">
	<template v-if="isCroppedNotNull">
		<div class="scale">🔍 {{ printScaleValue }}</div>
		<editor-adjust-status class="status" :status="cropped.status" :details="cropped.details" :cropped="cropped" />
		<div class="desktop" :style="getDesktopStyle">
			<img class="image" :src="getCroppedUrl" />
			<editor-adjust-boxes class="boxes" :width="cropped.width" :height="cropped.height" :boxes="this.ocr.words" />
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
		getSize()
		{
			const width = this.cropped.width * this.scale.x;
			const height = this.cropped.height * this.scale.y;
			return {width: width, height: height};
		},
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

<style scoped>
.editor
{
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.scale
{
	position:absolute;
	top: 3px; left: 3px;
	font: 12px var(--font);
	z-index: 2;
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
.desktop
{
	position:absolute;
	z-index: 0;
}
.image
{
	position: absolute;
	z-index: 0;
	width: 100%;
	height: 100%;
}
.boxes
{
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
}
.marks
{
	position: absolute;
	z-index: 2;
}

</style>