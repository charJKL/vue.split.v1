<template>
<div class="editor">
	<div class="toolbar">
		<label class="tool scale">🔍 {{ printScaleValue }}</label>
	</div>
	<template v-if="isCroppedNotNull">
		<editor-preview-status class="status" :cropped="this.cropped" />
		<div class="desktop" :style="getDesktopStyle">
			<img class="image" :src="getCroppedUrl" />
		</div>
	</template>
</div>
</template>

<script>
import RequireSource from './mixins/RequireSource';
import RequireCropped from './mixins/RequireCropped';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';
import EditorPreviewStatus from './EditorPreviewStatus';

export default
{
	mixins: [RequireSource, RequireCropped, ProvideScale, ProvidePosition],
	components: { EditorPreviewStatus },
	computed:
	{
		getDesktopStyle()
		{
			const width = this.cropped.width * this.scale.x;
			const height = this.cropped.height * this.scale.y;
			const left = this.position.x;
			const top = this.position.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		},
	},
	updated()
	{
		console.log('component was updated');
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
	@include status-fill;
}
.desktop
{
	@include desktop;
}
.image
{
	@include layer;
}
</style>