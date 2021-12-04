<template>
<div class="editor">
	<template v-if="isCropped">
		<div class="desktop" :style="getDesktopStyle">
			<img class="image" :src="getCroppedUrl" />
			<editor-adjust-boxes class="boxes" :width="getSize.width" :height="getSize.height" :boxes="getBoxes" />
			<editor-adjust-marks class="marks" />
		</div>
	</template>
	<div class="editor-scale">🔍 {{ printScaleValue }}</div>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';
import EditorAdjustBoxes from './EditorAdjustBoxes';
import EditorAdjustMarks from './EditorAdjustMarks';

export default
{
	mixins: [RequireCropped, RequireOcr, ProvideScale, ProvidePosition],
	components: { EditorAdjustBoxes, EditorAdjustMarks },
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
		},
		getBoxes()
		{
			const boxes = [];
			for(const line of this.ocr.lines)
			{
				for(const word of line.words)
				{
					boxes.push(word.bbox);
				}
			}
			return boxes;
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
.desktop
{
	position:absolute;
	z-index: 1;
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
}
.marks
{
	position: absolute;
	z-index: 2;
}
</style>