<template>
<div class="footer">
	<div class="footer-left">
		<editor-input :source="source" :metrics="metrics"  @update:source="onUpdateSource" @update:metrics="onUpdateMetrics"></editor-input>
	</div>
	<div class="footer-right">
		<button id="save" @click="onSaveData">Save</button>
	</div>
</div>
</template>

<script>
import EditorInput from './EditorInput.vue';
import {selectCurrent, updateMetrics} from '../store/records';

export default
{
	components: { EditorInput },
	data()
	{
		return {
			internal: null,
		}
	},
	computed:
	{
		source()
		{
			return this.$store.getters.source;
		},
		metrics()
		{
			return this.$store.getters.metrics;
		},
	},
	watch:
	{
		source(source)
		{
			if(source === null) return;
			this.internal = source;
		},
	},
	methods:
	{
		onUpdateSource(source)
		{
			this.$store.dispatch(selectCurrent, source.filename);
		},
		onUpdateMetrics(metrics)
		{
			this.$store.dispatch(updateMetrics, metrics);
		},
		onSaveData()
		{
			//this.$store.dispath(loadSave, e.target.files[0]);
		}
	}
}
</script>

<style scoped>
.footer
{
	flex: 0 0 auto;
	margin-top: auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
.footer-left
{
	margin-right: auto;
}
.footer-right
{
	margin-left: auto;
}
</style>
