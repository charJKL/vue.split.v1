<template>
<div :class="['preview']">
	preview image
</div>
</template>

<script>
import {isMatch} from '../lib/isMatch';

const blueprint = 
{
	padding: { top: 12, right: 12, bottom: 12, left: 12 },
}

export default
{
	props:
	{
		padding: { type: Object, default: blueprint.padding, validator(value){ return isMatch(blueprint.padding, value); } },
	}
}
</script>

<style scoped>
.preview
{
	height: 100%;
	user-select: none;
	display:flex;
	justify-content: center;
	align-items: center;
	background: red;
}
</style>