<template>
	<template v-if="current.loaded == true">
		<div :class="['editor', getEditorClasses]" v-bind="$attrs" ref="thumbnail">
			<div class="name">{{ getName }}</div>
			<canvas-mask class="mask" :size="imageSize" :spot="spotPosition"></canvas-mask>
			<img class="img" :style="getImageStyle" :src="getImageUrl" />
		</div>
	</template>
	<template v-if="current.loaded == false">
		<div :class="['editor', getEditorClasses]" v-bind="$attrs">
			<img class="waiting" src="../assets/waiting.svg" />
			<div class="name">{{ getName }}</div>
		</div>
	</template>
</template>

<script>
import EditorBase from './mixins/EditorBase';
import EditorOffset from './mixins/EditorOffset';
import EditorScale from './mixins/EditorScale';
import CanvasMask from './utils/CanvasMask';

export default
{
	mixins: [ EditorBase, EditorOffset, EditorScale ],
	components: { CanvasMask },
	data()
	{
		return {}
	},
	computed:
	{
		getEditorClasses()
		{
			const isSelected = this.$store.getters.source == this.source ? 'selected' : '';
			return [isSelected];
		},
		getImageUrl()
		{
			return this.current.url;
		},
		getImageStyle()
		{
			return { transform: `rotate(${this.scaled.rotate.value}deg)` };
		},
		getName()
		{
			return this.current.filename;
		},
		imageSize()
		{
			const width = Math.ceil(this.current.size.width * this.scale);
			const height = Math.ceil(this.current.size.height * this.scale);
			return { width: width, height: height };
		},
		spotPosition()
		{
			const width = this.scaled.x2.value - this.scaled.x1.value;
			const height = this.scaled.y2.value - this.scaled.y1.value;
			return { x: this.scaled.x1.value, y: this.scaled.y1.value, width: width, height: height };
		}
	},
	mounted()
	{
		this.viewport = { width: Infinity, height: 96 };
		this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
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
.editor.selected { border: solid 2px rgba(255, 0, 0, 1); }
.editor:not(.selected):hover { border: solid 2px rgba(210, 0, 0, 1); }
.img
{
	height: 100%;
	object-fit: cover;
	z-index: 1;
}
.waiting
{
	position: absolute;
	width: 30px;
	left: calc((130px - 30px) / 2);
	top: calc((96px - 30px) / 2 - 10px);
}
.mask
{
	position:absolute;
	left:0px; top: 0px;
	z-index: 2;
}
.name
{
	position: absolute;
	width: 100%;
	left: 0px; bottom: 0px;
	text-align: center;
	font: 11px / 20px var(--font);
	background: rgba(0, 0, 0, .6);
	color: #fff;
	z-index: 3;
}
</style>