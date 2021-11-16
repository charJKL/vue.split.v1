<template>
	<div class="image">
		<div class="name">{{ getName }}</div>
		<svg class="canvas" ref="canvas" :style="getCanvasStyle">
			<svg-mask :size="highlightSize" :spot="highlightSpot"></svg-mask>
		</svg>
		<img class="img" :src="getImageUrl" />
	</div>
</template>

<script>
import SvgMask from './utils/SvgMask';
import {record} from '../store/records';
import {isMatch} from '../lib/isMatch';


export default
{
	components: { SvgMask },
	props:
	{
		record: { type: Object, required: true, validator(value){ return isMatch(value, record); } },
	},
	computed:
	{
		highlightSize()
		{
			return {x: 0, y: 0, width: 100, height: 100};
		},
		highlightSpot()
		{
			return {x: 0, y: 0, width: 100, height: 100};
		},
		getImageUrl()
		{
			return this.record.source.url;
		},
		getImageClass()
		{
			return '';
		},
		getLayerClass()
		{
			return this.$store.getters.current === this.record ? 'selected' : '';
		},
		wasEdited()
		{
			return this.record.wasEdited;
		},
		getName()
		{
			return this.record.source.filename;
		}
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
.layer
{
	position: absolute;
	top:0px; left: 0px;
	width: 100%; height: 100%;
	z-index: 2;
}
.layer.selected{ background: rgba(255,0,0,.3); }
.image:hover .layer{ background: rgba(0,0,255,.3); }
.image:hover .layer.selected{ background-image: repeating-linear-gradient(120deg, rgba(255,0,0,.3), rgba(255,0,0,.3) 20px, rgba(0,0,255,.3) 20px, rgba(0,0,255,.3) 40px); }
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
