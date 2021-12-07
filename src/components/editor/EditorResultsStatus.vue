<template>
<div class="box" v-if="isStatusNotCompleted">
	<template v-if="isStatusDirty">
		<div class="bar">
			<div class="status">Data is outdated.</div>
		</div>
	</template>
	<template v-if="isStatusQueued">
		<div class="bar">
			<div class="status">Data is outdated.</div>
			<div class="details dots">Waiting in queue</div>
		</div>
	</template>
	<template v-if="isStatusLoading">
		<div class="bar">
			<div class="status dots">Start working on new data</div>
			<div class="details">{{ printDetails }}</div>
		</div>
	</template>
	<template v-if="isStatusWorking">
		<div class="bar">
			<div class="status dots">Working on new data</div>
			<div class="details">{{ printDetails }}/100%</div>
		</div>
	</template>
</div>
</template>

<script>
import ProvideStatus from './mixins/ProvideStatus';

export default
{
	mixins: [ProvideStatus],
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