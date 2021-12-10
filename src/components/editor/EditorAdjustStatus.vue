<template>
<div class="box" v-if="isStatusNotCompleted">
	<template v-if="isStatusDirty">
		<div class="bar">
			<div class="status">Page wasn't adjusted yet.</div>
		</div>
	</template>
	<template v-if="isStatusDirty && havePreviousData">
		<div class="bar">
			<div class="status">Page adjustment is outdated, may be inaccurate.</div>
		</div>
	</template>
	
	<template v-if="isStatusWaiting">
		<div class="bar">
			<div class="status">Waiting on your hesitation before get to job.</div>
			<div class="details">Counting 123 to zero.</div>
		</div>
	</template>
	<template v-if="isStatusWaiting && havePreviousData">
		<div class="bar">
			<div class="status">Clip you you see is outdated, hanging on your hesitation.</div>
			<div class="details">Counting 123 to zero.</div>
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
			<div class="status">Clip you see is outdated, waiting in queue for new data.</div>
			<div class="details dots">I'am xxx in queue</div>
		</div>
	</template>
	
	<template v-if="isStatusWorking">
		<div class="bar">
			<div class="status dots">Clipping image</div>
			<div class="details">{{ printDetails }}/100%</div>
		</div>
	</template>
	<template v-if="isStatusWorking && havePreviousData">
		<div class="bar">
			<div class="status dots">Clip you see is outdated, clipping image</div>
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
		cropped: {Type: Object, Required: true},
	},
	mixins: [ProvideStatus],
	computed:
	{
		havePreviousData()
		{
			return this.cropped.wasCropped === true;
		}
	}
}
</script>

<style scoped>
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