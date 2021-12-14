<template>
<div class="footer">
	<div class="footer-left">
		<editor-input class="editor" :source="source" :metrics="metrics"  @update:source="onUpdateSource" @update:metrics="onUpdateMetrics"></editor-input>
	</div>
	<div class="footer-right">
		<ui-footer-save class="save" />
	</div>
</div>
</template>

<script>
import EditorInput from './editor/EditorInput';
import UiFooterSave from './UiFooterSave';
import {updateMetrics} from '../store/records';
import {mapGetters} from 'vuex';

export default
{
	components: { EditorInput, UiFooterSave },
	data()
	{
		return {
			internal: null,
		}
	},
	computed:
	{
		...mapGetters(['source', 'metrics', 'ocr', 'features'])
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
		onUpdateSource()
		{
			//this.$store.dispatch(selectCurrent, source.filename);
		},
		onUpdateMetrics(metrics)
		{
			this.$store.dispatch(updateMetrics, metrics);
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
	background: var(--gray);
	z-index: 2;
}
.footer-left
{
	margin-right: auto;
}
.footer-right
{
	margin-left: auto;
}
.save
{
	margin: 10px 10px 10px 0px;
}
.editor
{
	margin: 10px 0px 10px 10px;
}
</style>
