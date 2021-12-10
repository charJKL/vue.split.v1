<template>
<div :class="getStatusClass" v-if="isCroppedNotCompleted">
		<div class="box">
			<h1>{{ printCroppedStatus }}</h1>
			<h2>{{ printCroppedDetails }}</h2>
		</div>
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';

export default
{
	mixins: [RequireCropped],
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
		}
	}
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