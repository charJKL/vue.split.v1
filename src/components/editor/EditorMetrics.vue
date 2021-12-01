<template>
	<div class="editor" ref="editor" @mousedown.left="onLeftDown" @mousedown.right="onRightDown" @mouseup.left="onLeftUp" @mouseup.right= "onRightUp" @mousemove="onMove" @mouseleave="onLeave" @wheel="onWheel" @contextmenu="onContextmenu">
		<template v-if="isSource">
			<img class="image" ref="image" :style="getImageStyle" :src="source.url" />
		</template>
	</div>
</template>

<script>
import RequireMetrics from './mixins/RequireMetrics';
import RequireSource from './mixins/RequireSource';
import ProvideScale from './mixins/ProvideScale';
import ProvideOffset from './mixins/ProvideOffset';
import EditorMetricsMouse from './EditorMetricsMouse';

export default
{
	mixins: [RequireMetrics, RequireSource, ProvideScale, ProvideOffset, EditorMetricsMouse],
	data()
	{
		return {
			viewport: {width: 0, height: 0},
		}
	},
	computed:
	{
		getImageStyle()
		{
			const width = this.scaled.width;
			const height = this.scaled.height;
			const rotate = this.metrics.rotate;
			const left = this.offset.x;
			const top = this.offset.y;
			return { width: `${width}px`, height: `${height}px`, top: `${top}px`, left: `${left}px`, transform: `rotate(${rotate}deg)` };
		}
	},
	watch:
	{
		source(source)
		{
			if(this.isLoadingDone === false) return;
			const size = { width: source.width, height: source.height };
			this.scale = this.calcRatioScaleValue(this.viewport, size);
			this.offset = this.calcOffsetCenterValue(this.viewport, this.scaled);
		}
	},
	mounted()
	{
		this.viewport = {width: this.$refs.editor.clientWidth, height: this.$refs.editor.clientHeight };
	}
}
</script>

<style scoped>
.editor
{
	position:relative;
	width: 100%;
	height: 100%;
	background: red;
	overflow: hidden;
}
.image
{
	position: absolute;
}
</style>