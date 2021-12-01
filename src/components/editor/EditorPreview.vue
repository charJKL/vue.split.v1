<template>
	<template v-if="isCropped">
			<div v-if="isCroppedDirty">
				Dirty
			</div>
			<img src="" :style="getImageStyle"/>
	</template>
</template>

<script>
import RequireSource from './mixins/RequireSource';
import RequireMetrics from './mixins/RequireMetrics';
import RequireCropped from './mixins/RequireCropped';
import ProvideScale from './mixins/ProvideScale';
import ProvidePosition from './mixins/ProvidePosition';

export default
{
	mixins: [RequireSource, RequireMetrics, RequireCropped, ProvideScale, ProvidePosition],
	computed:
	{
		getImageStyle()
		{
			const width = this.cropped.width * this.scale;
			const height = this.cropped.height * this.scale;
			const left = this.position.x;
			const top = this.position.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px` };
		},
	}
}
</script>

<style scoped>

</style>