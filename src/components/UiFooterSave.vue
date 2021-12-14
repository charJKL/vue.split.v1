<template>
<div class="div" @mouseenter="onSaveEnter" @mouseleave="onSaveLeave">
	<div class="tooltip" v-if="showTooltip">
		There are {{ notDonePagesCount }} of {{ pagesCount }} pages not done, skip it?
	</div>
	<button id="save" @click="onSaveData" :disabled="thereAreImages">{{ getButtonText }}</button>
	<a ref="download" style="display:none"/>
</div>
</template>

<script>
import {getResults} from '../store/records';
import {mapGetters} from 'vuex';

export default
{
	data()
	{
		return {
			showTooltip: false
		}
	},
	computed:
	{
		...mapGetters(['records','features']),
		pagesCount()
		{
			return this.records.length;
		},
		notDonePagesCount()
		{
			return this.records.filter(record => record.ocr.wasParsed === false).length;
		},
		getButtonText()
		{
			return this.showTooltip ? 'Yes, save only what was done.' : 'Save';
		},
		thereAreImages()
		{
			return this.pagesCount == 0;
		}
	},
	methods: 
	{
		onSaveEnter()
		{
			if(this.notDonePagesCount > 0) this.showTooltip = true;
		},
		onSaveLeave()
		{
			this.showTooltip = false;
		},
		async onSaveData()
		{
			const text = await this.$store.dispatch(getResults);
			const blob = new Blob([text], { type: "text/plain" });
			
			this.$refs.download.href = URL.createObjectURL(blob);
			this.$refs.download.download = 'result.txt';
			this.$refs.download.click();
		}
	}
}
</script>

<style lang="scss" scoped>
$tooltip-background: rgba(220, 220, 220, 1);
$tooltip-border: rgba(120, 120, 120, 1);

.div
{
	position: relative;
	background:yellow;
}
button
{
	box-sizing: border-box;
	height: 30px;
}
.tooltip
{
	position: absolute;
	white-space: nowrap;
	right: 0px;
	bottom: 38px;
	padding: 10px 15px;
	box-sizing: border-box;
	background: $tooltip-background;
	border: solid 1px $tooltip-border;
	transform-style: preserve-3d;
}
.tooltip:before
{
	content: '';
	position:absolute;
	width: 10px;
	height: 10px;
	bottom: -4px; right: 10px;
	transform: rotate(45deg) translateZ(-1px);
	background: $tooltip-background;
	border: solid 1px $tooltip-border;
}
</style>