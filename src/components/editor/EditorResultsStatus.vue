<template>
<div class="box" v-if="isStatusNotCompleted">
	<template v-if="isStatusDirty">
		<div class="bar">
			<div class="status">Don't have text yet.</div>
		</div>
	</template>
	<template v-if="isStatusDirty && havePreviousData">
		<div class="bar">
			<div class="status">Text you see is outdated, may be inaccurate.</div>
		</div>
	</template>
	
	
	<template v-if="isStatusQueued">
		<div class="bar">
			<div class="status">Waiting in queue to get data for you.</div>
			<div class="details dots">I' am xxx in queue</div>
		</div>
	</template>
	<template v-if="isStatusQueued && havePreviousData">
		<div class="bar">
			<div class="status">Text you see is outdated, waiting in queue for new data.</div>
			<div class="details dots">I'am xxx in queue</div>
		</div>
	</template>
	
	
	<template v-if="isStatusLoading">
		<div class="bar">
			<div class="status dots">Preparing work for data.</div>
			<div class="details">{{ printDetails }}</div>
		</div>
	</template>
	<template v-if="isStatusLoading && havePreviousData">
		<div class="bar">
			<div class="status dots">Text you see is outdated, prepare work for new text data</div>
			<div class="details">{{ printDetails }}</div>
		</div>
	</template>
	
	
	<template v-if="isStatusWorking">
		<div class="bar">
			<div class="status dots">I'm working</div>
			<div class="details">{{ printDetails }}/100%</div>
		</div>
	</template>
	<template v-if="isStatusWorking && havePreviousData">
		<div class="bar">
			<div class="status dots">Text you see is outdated, working on new one</div>
			<div class="details">{{ printDetails }}/100%</div>
		</div>
	</template>
</div>
</template>

<script>
import ProvideStatus from './mixins/ProvideStatus';

export default
{
	props:
	{
		ocr: {Type: Object, Required: true},
	},
	mixins: [ProvideStatus],
	computed:
	{
		havePreviousData()
		{
			return this.ocr?.wasParsed === true;
		}
	}
}
</script>

<style>
.bar
{
	margin: 20px 0px 0px 0px;
	text-align: center;
}
.status
{
	font: bold 18px var(--font);
}
.details
{
	font: 16px var(--font);
}
.dots:after
{
	position:absolute;
	animation:dots 1s linear infinite;
	content: "";
}
@keyframes dots {
	0% {content: "";}
	33% {content: ".";}
	66% {content: "..";}
	100% {content: "...";}
}
</style>