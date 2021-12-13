<template>
<div class="editor">
	<template v-if="isOcrNotNull">
		<editor-results-status class="status" :ocr="ocr" />
		<div class="desktop">
			<editor-results-line class="line" v-for="({line, change}, i) of list" :key="i" :line="line" :change="change" @update:text="onUpdateText(i, line, $event)" @update:apply="onUpdateApply(i, line, $event)" />
		</div>
	</template>
</div>
</template>

<script>
import RequireOcr from './mixins/RequireOcr';
import RequireFeatures, {updateFeatures} from './mixins/RequireFeatures';
import EditorResultsStatus from './EditorResultsStatus';
import EditorResultsLine from './EditorResultsLine';
import {change} from '../../store/records';

export default
{
	components: {EditorResultsStatus, EditorResultsLine},
	mixins: [RequireOcr, RequireFeatures],
	computed:
	{
		list()
		{
			const list = [];
			for(let i=0; i < this.ocr.lines.length; i++)
			{
				list.push({
					line: this.ocr.lines[i],
					change: this.features.changes?.[i] ?? null
				})
			}
			return list;
		}
	},
	methods:
	{
		onUpdateText(i, line, text)
		{
			const vchange = this.features.changes?.[i] ? {...this.features.changes[i]} : {...change};
			vchange.text = text;
			
			const vfeatures = {...this.features};
			vfeatures.changes = [...vfeatures.changes];
			vfeatures.changes[i] = vchange;
			this.$emit(updateFeatures, vfeatures);
		},
		onUpdateApply(i, line, apply)
		{
			const vchange = this.features.changes?.[i] ? {...this.features.changes[i]} : {...change};
			vchange.apply = apply;
			
			const vfeatures = {...this.features};
			vfeatures.changes = [...vfeatures.changes];
			vfeatures.changes[i] = vchange;
			this.$emit(updateFeatures, vfeatures);
		}
	}
}
</script>

<style lang="scss" scoped>
.editor
{
	@include editor;
}
.status
{
	@include status-top;
}
.desktop
{
	height: 100%;
	overflow: auto;
}
.line
{
	width: 100%;
}
</style>