<template>
<div :class="getStatusClass" v-if="isOcrNotCompleted">

	<div class="box" v-if="isOcrDirty && haveOcrData">
		<h1>Text you see is outdated, may be inaccurate.</h1>
	</div>
	<div class="box" v-else-if="isOcrDirty">
		<h1>Don't have text yet.</h1>
	</div>
	
	<div class="box" v-if="isOcrStall && haveOcrData">	
		<h1>Text you see is outdated,  waiting for cropped.</h1>
		<h2>I will start parsing page as soon as new cropped image will come up.</h2>
	</div>
	<div class="box" v-else-if="isOcrStall">	
		<h1>Waiting for cropped.</h1>
		<h2>I will start parsing page as soon as new cropped image will come up.</h2>
	</div>
	
	<div class="box" v-if="isOcrQueued && haveOcrData">	
		<h1>Text you see is outdated, waiting in queue for new data.</h1>
		<h2 class="dots">I'm in queue</h2>
	</div>
	<div class="box" v-else-if="isOcrQueued">	
		<h1>Waiting in queue to get data for you.</h1>
		<h2 class="dots">I'm in queue</h2>
	</div>
	
	<div class="box" v-if="isOcrLoading && haveOcrData">	
		<h1 class="dots">Text you see is outdated, prepare work for new text data</h1>
		<h2>{{ printOcrDetails }}</h2>
	</div>
	<div class="box" v-else-if="isOcrLoading">	
		<h1 class="dots">Preparing work for data.</h1>
		<h2>{{ printOcrDetails }}</h2>
	</div>
	
	<div class="box" v-if="isOcrWorking && haveOcrData">	
		<h1 class="dots">Text you see is outdated, working on new one</h1>
		<h2>{{ printOcrDetails }}/100%</h2>
	</div>
	<div class="box" v-else-if="isOcrWorking">	
		<h1 class="dots">I'm working</h1>
		<h2>{{ printOcrDetails }}/100%</h2>
	</div>
	
	<div class="box" v-if="isOcrError && haveOcrData">
		<h1>Error occured, try again by changing metrics.</h1>
		<h2>{{ printOcrDetails }}</h2>
	</div>
	<div class="box" v-else-if="isOcrError">
		<h1>Error occured, try again by changing metrics.</h1>
		<h2>{{ printOcrDetails }}</h2>
	</div>
</div>
</template>

<script>
import RequireOcr from './mixins/RequireOcr';

export default
{
	mixins: [RequireOcr],
	computed:
	{
		getStatusClass()
		{
			const removeGradientWhenHaventData = this.haveOcrData == true ? '' : 'remove-gradient';
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