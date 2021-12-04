<template>
<div class="editor">
	<template v-if="isCropped">
		<img class="image" :src="getCroppedUrl" :style="getImageStyle"/>
	</template>
	<div class="editor-scale">🔍 {{ printScaleValue }}</div>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';

export default
{
	mixins: [RequireCropped, ProvideScale, ProvidePosition],
	computed:
	{
		getImageStyle()
		{
			const width = this.cropped.width * this.scale.x;
			const height = this.cropped.height * this.scale.y;
			const left = this.position.x;
			const top = this.position.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		},
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
.image
{
	position: absolute;
}
.editor-scale
{
	position:absolute;
	top: 3px; left: 3px;
	font: 12px var(--font);
}
</style>