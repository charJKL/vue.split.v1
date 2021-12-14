<template>
<section class="statuses">
	<div class="status metrics">
		<div class="indicator indicator-dirty" v-if="wasMetricsEdited == false"></div>
		<div class="indicator indicator-completed" v-if="wasMetricsEdited == true"></div>
	</div>
	<div class="status cropped">
		<div class="indicator indicator-dirty" v-if="isCroppedDirty"></div>
		<div class="indicator indicator-stall" v-if="isCroppedStall"></div>
		<div class="indicator indicator-waiting" v-if="isCroppedWaiting"></div>
		<div class="indicator indicator-queued" v-if="isCroppedQueued" ></div>
		<div class="indicator indicator-loading" v-if="isCroppedLoading"></div>
		<div class="indicator indicator-working" v-if="isCroppedWorking"></div>
		<div class="indicator indicator-completed" v-if="isCroppedCompleted"></div>
	</div>
	<div class="status ocr">
		<div class="result small" v-if="isOcrWorking">{{ printOcrDetails }}%</div>
		<div class="indicator indicator-dirty" v-if="isOcrDirty"></div>
		<div class="indicator indicator-stall" v-if="isOcrStall"></div>
		<div class="indicator indicator-waiting" v-if="isOcrWaiting"></div>
		<div class="indicator indicator-queued" v-if="isOcrQueued" ></div>
		<div class="indicator indicator-loading" v-if="isOcrLoading"></div>
		<div class="indicator indicator-working animation-blink" v-if="isOcrWorking"></div>
		<div class="indicator indicator-completed" v-if="isOcrCompleted"></div>
	</div>
	<div class="status features">
		<div class="result" v-if="isOcrCompleted">{{getChangesCount}}</div>
		<div class="indicator indicator-dirty" v-if="isCroppedNotCompleted && isOcrNotCompleted"></div>
		<div class="indicator indicator-stall" v-if="isCroppedCompleted || isOcrCompleted"></div>
		<div class="indicator indicator-completed" v-if="isCroppedCompleted && isOcrCompleted"></div>
	</div>
</section>
</template>

<script>
import RequireSource from './mixins/RequireSource';
import RequireMetrics from './mixins/RequireMetrics';
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';
import RequireFeatures from './mixins/RequireFeatures';

export default
{
	mixins: [RequireSource, RequireMetrics, RequireCropped, RequireOcr, RequireFeatures],
	computed:
	{

	}
}
</script>

<style lang="scss" scoped>
.statuses
{
	display: flex;
	flex-flow: row nowrap;
}
.status
{
	position: relative;
	flex: 1 0 0;
}
.indicator
{
	position: absolute;
	left: 0px; bottom: 0px;
	height: 3px; 
	width: 100%;
	background: red;
}
.indicator-dirty{ background: rgba(180, 180, 180, 1); }
.indicator-stall{ background: rgba(240, 200, 100, 1); }
.indicator-waiting{ background: rgba(200, 240, 100, 1); }
.indicator-queued{ background: rgba(255, 255, 0, 1); }
.indicator-loading{ background: rgba(100, 200, 255, 1); }
.indicator-working{ background: rgba(50, 50, 200, 1); }
.indicator-completed{ background: rgba(0, 200, 0, 1); }
.result
{
	text-align: center;
	margin: 0px 0px 4px 0px;
}
.small
{
	font: 11px $font;
}
.animation-blink
{
	animation:blinking 0.5s linear infinite;
}
@keyframes blinking {
	0% { background: rgba(50, 50, 200, 1);}
	50% { background: rgba(100, 200, 200, 1);}
	100% { background: rgba(50, 50, 200, 1);}
}
</style>