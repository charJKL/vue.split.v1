<template>
<div v-if="isOcrNotCompleted">
	<div class="box" v-if="isOcrDirty && haveOcrData">
		<h1>Some data you see are outdated.</h1>
		<h2>Red box indicators you see are outdated, the come from previous reconginsons.</h2>
	</div>
	<div class="box" v-if="isOcrDirty">
		<h1>Page wasn't adjusted yet.</h1>
	</div>
	
	
	<div class="box" v-if="isOcrStall && haveOcrData">
		<h1>Hints you see are outdated, waiting for cropped.</h1>
		<h2>I will give you new data as soon as new cropped data will come up.</h2>
	</div>
	<div class="box" v-if="isOcrStall">
		<h1>Waiting for new cropped data.</h1>
		<h2>I will give you new data as soon as new cropped data will come up.</h2>
	</div>
	
	
	<div class="box" v-if="isOcrQueued && haveOcrData">
		<h1>Hints you see are outdated, waiting in queue to get data for you.</h1>
		<h2 class="dots">I'am in queue</h2>
	</div>
	<div class="box" v-if="isOcrQueued">
		<h1>Waiting in queue to get data for you.</h1>
		<h2 class="dots">I'am in queue</h2>
	</div>
	
	
	<div class="box" v-if="isOcrWorking && haveOcrData">
		<h1>It's stupid to write here status for ocr ???</h1>
		<h2 class="dots">???</h2>
	</div>
	<div class="box" v-if="isOcrWorking">
		<h1>It's stupid to write here status of ocr?.</h1>
		<h2 class="dots">I'am in queue</h2>
	</div>
	
</div>
</template>

<script>
import RequireCropped from './mixins/RequireCropped';
import RequireOcr from './mixins/RequireOcr';

export default
{
	mixins: [RequireCropped, RequireOcr],
}
</script>

<style lang="sass" scoped>

</style>