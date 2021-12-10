<template>
<div :class="getStatusClass" v-if="isCroppedNotCompleted">
	<template v-if="isCroppedWaiting">
		<div class="box">
			<h1>{{ printCroppedStatus }}</h1>
			<h2>{{ getCouterValue }}</h2>
		</div>
	</template>
	<template v-else>
		<div class="box">
			<h1>{{ printCroppedStatus }}</h1>
			<h2>{{ printCroppedDetails }}</h2>
		</div>
	</template>
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
			const isStallOnMetrics = this.isCroppedStall == true && this.cropped.details === 'metrics' ? 'remove-background' : '';
			return [isStallOnMetrics];
		},
		havePreviousData()
		{
			return this.cropped.wasCropped === true;
		},
		getCouterValue()
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
			console.log('animation frame');
			this.timestamp = Date.now();
			this.animationFrameId = window.requestAnimationFrame(this.animationFrame);
		}
	},
}
</script>

<style lang="scss" scoped>
.remove-background
{
	background: none;
}
.box
{
	text-align: center;
	padding: 10px 15px;
	width: 150px;
	background: #fff;
	h1{
		margin: 0px;
		font: bold 18px / 22px $font;
	}
	h2{
		margin: 0px;
		font: 11px / 16px $font;
	}
}


</style>