<template>
<div :class="getStatusClass" v-if="isCroppedNotCompleted || isOcrNotCompleted">
	<div class="box" v-if="isCroppedNotCompleted && haveCroppedBlob">
		<h1>Fragment you see is outdated, waiting for new image.</h1>
		<h2 class="dots" v-if="isCroppedStall">Cropping job is waiting on resource</h2>
		<h2 class="dots" v-if="isCroppedWaiting">Cropping waiting holding on your hesitation</h2>
		<h2 class="dots" v-if="isCroppedWorking">Cropping is under process</h2>
	</div>
	<div class="box" v-else-if="isCroppedNotCompleted">
		<h1>Waiting for cropped fragment.</h1>
		<h2 class="dots" v-if="isCroppedStall">Cropping job is waiting on resource</h2>
		<h2 class="dots" v-if="isCroppedWaiting">Cropping waiting holding on your hesitation</h2>
		<h2 class="dots" v-if="isCroppedWorking">Cropping is under process</h2>
	</div>
	
	<div class="box" v-if="isOcrNotCompleted && haveOcrData">
		<h1>Red box marks you see are outdated, waiting for new one</h1>
		<h2 class="dots" v-if="isOcrStall">Job waiting on resource</h2>
		<h2 class="dots" v-if="isOcrQueued">Job waiting in queue</h2>
		<h2 class="dots" v-if="isOcrLoading">Tesseract is loading</h2>
		<h2 class="dots" v-if="isOcrWorking">Parser is working</h2>
	</div>
	<div class="box" v-else-if="isOcrNotCompleted">
		<h1>Waiting for parse to get data.</h1>
		<h2 class="dots" v-if="isOcrStall">Job waiting on resource</h2>
		<h2 class="dots" v-if="isOcrQueued">Job waiting in queue</h2>
		<h2 class="dots" v-if="isOcrLoading">Tesseract is loading</h2>
		<h2 class="dots" v-if="isOcrWorking">Parser is working</h2>
	</div>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';

export default
{
	mixins: [RequireCropped, RequireOcr],
	computed:
	{
		getStatusClass()
		{
			const removeGradientWhenHaventData = this.haveOcrData == true || this.haveCroppedBlob == true ? '' : 'remove-gradient';
			return ['status', removeGradientWhenHaventData];
		}
	}
}
</script>

<style lang="scss" scoped>
.status
{
	@include status-text;
	> .box
	{
		margin: 30px 0px 0px 0px;
	}
}
.status.remove-gradient{ background: none; }
.dots
{
	@include dots-animation;
}
</style>