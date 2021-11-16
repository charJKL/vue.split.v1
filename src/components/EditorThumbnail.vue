<template>
	<div class="image" ref="thumbnail">
		<div class="name">{{ getName }}</div>
		<canvas-mask class="mask" :size="imageSize" :spot="spotPosition"></canvas-mask>
		<img class="img" :src="getImageUrl" />
	</div>
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
		getImageUrl()
		{
			return this.current.url;
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
			console.log(this.scaled, width, height);
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
.image
{
	position: relative;
	height: 96px;
	margin: 0px 5px;
	cursor: pointer;
	border: solid 2px #000;
}
.img
{
	height: 100%;
	object-fit: cover;
	z-index: 1;
}
.mask
{
	position:absolute;
	left:0px; top: 0px;
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
	z-index: 5;
}
</style>