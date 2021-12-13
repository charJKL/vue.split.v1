<template>
<div :class="getStatusClass" v-if="isCroppedNotCompleted">
	<div class="box" v-if="isCroppedDirty && haveCroppedBlob">
		<h1>Fragment you see is outdated.</h1>
	</div>
	<div class="box" v-else-if="isCroppedDirty">
		<h1>I don't cropped any image yet.</h1>
	</div>
	
	<div class="box" v-if="isCroppedStall && isStallCauseBySource && haveCroppedBlob">
		<h1>Fragment you see is outdated, waiting for image to load.</h1>
		<h2>I will crop image as soon as it will become available.</h2>
	</div>
	<div class="box" v-else-if="isCroppedStall && isStallCauseBySource">
		<h1>Waiting for image to load.</h1>
		<h2>I will crop image as soon as it will become available.</h2>
	</div>
	
	<div class="box" v-if="isCroppedStall && isStallCauseByMetrics && haveCroppedBlob">
		<h1>Fragment you see is outdated, waiting on metrics changes.</h1>
		<h2>Change default values of metrics to see crop image.</h2>
	</div>
	<div class="box" v-else-if="isCroppedStall && isStallCauseByMetrics">
		<h1>Waiting for metrics changes.</h1>
		<h2>Change default values of metrics to see crop image.</h2>
	</div>

	<div class="box" v-if="isCroppedWaiting && haveCroppedBlob">
		<h1>Fragment you see is outdated, hanging on your hesitation.</h1>
		<h2>Waiting {{ getWaitingCounter }}ms</h2>
	</div>
	<div class="box" v-else-if="isCroppedWaiting">
		<h1>Hanging on your hesitation.</h1>
		<h2>Waiting {{ getWaitingCounter }}ms</h2>
	</div>
	
	<div class="box" v-if="isCroppedWorking && haveCroppedBlob">
		<h1>Fragment you see is outdated, working on new one.</h1>
		<h2 class="dots">Working</h2>
	</div>
	<div class="box" v-else-if="isCroppedWorking">
		<h1>Cutting page to desired size.</h1>
		<h2 class="dots">Working</h2>
	</div>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';

export default
{
	mixins: [RequireCropped],
	data()
	{
		return {
			animationFrameId: null,
			timestamp: 0
		}
	},
	computed:
	{
		getStatusClass()
		{
			const isStall = this.isCroppedStall == true ? 'remove-background' : '';
			return ['status', isStall];
		},
		getWaitingCounter()
		{
			return parseInt(this.cropped.details) - this.timestamp;
		}
	},
	watch:
	{
		isCroppedWaiting(value)
		{
			switch(value)
			{
				case true:
					this.animationFrameId = window.requestAnimationFrame(this.animationFrame);
					return;
				
				case false:
					window.cancelAnimationFrame(this.animationFrameId);
					return;
			}
		}
	},
	methods:
	{
		animationFrame()
		{
			this.timestamp = Date.now();
			this.animationFrameId = window.requestAnimationFrame(this.animationFrame);
		}
	},
}
</script>

<style lang="scss" scoped>
.status
{
	@include status-text;
}
.status.remove-background{ background: none; }
.dots
{
	@include dots-animation;
}
</style>