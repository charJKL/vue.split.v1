<template>
	<template v-if="isLoadingIdle">
		<div :class="getEditorClass" :style="getEditorStyle" v-bind="$attrs">
			<img class="placeholder" src="../../assets/placeholder.svg" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
	<template v-if="isLoadingWaiting">
		<div :class="getEditorClass" :style="getEditorStyle" v-bind="$attrs">
			<img class="waiting" src="../../assets/waiting.svg" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
	<template v-if="isLoadingDone">
		<div :class="getEditorClass" :style="getEditorStyle" v-bind="$attrs">
			<img class="waiting" :style="getImageStyle" :src="getImageUrl" />
			<div class="name" v-html="getName"></div>
		</div>
	</template>
</template>

<script>
import RequireSource from './mixins/RequireSource';
import RequireMetrics from './mixins/RequireMetrics';
import ProvideScale from './mixins/ProvideScale';

export default
{
	mixins: [RequireSource, RequireMetrics, ProvideScale],
	computed:
	{
		getEditorClass()
		{
			return ['editor'];
		},
		getEditorStyle()
		{
			const width = this.scaled.width;
			const height = this.scaled.height;
			return { width: `${width}px`, height: `${height}px` };
		},
		getImageStyle()
		{
			const width = this.scaled.width;
			const height = this.scaled.height;
			const rotate = 20;
			return { width: `${width}px`, height: `${height}px`, transform: `rotate(${rotate}deg)` };
		},
		getName()
		{
			return this.source.name;
		},
		getImageUrl()
		{
			return this.source.url;
		}
	},
	mounted()
	{
		const viewport = { width: Infinity, height: 96 };
		const size = { width: this.source.width, height: this.source.height };
		this.scale = this.calcRatioScaleValue(viewport, size);
	}
}
</script>

<style scoped>
.editor
{
	position: relative;
	flex: 0 0 130px;
	height: 96px;
	margin: 0px 5px;
	cursor: pointer;
	border: solid 2px #000;
	overflow: hidden;
}
.placeholder
{
	position: absolute;
	width: 90px;
	height: 70px;
	color: red;
}
</style>