<template>
<div>
	<input class="line-checkbox" type="checkbox" :checked="isApply" :disabled="isDisabled" @change="onChangeApply"/>
	<input class="line-text" :value="getText" @input="onUpdateText" />
</div>
</template>

<script>
import {line, change} from '../../store/records';
import {isMatch} from '../../lib/isMatch';

export const updateText = 'update:text';
export const updateApply = 'update:apply';

export default
{
	props:
	{
		line: { type: Object, requred: true, validator(value){ return isMatch(line, value); } },
		change: { type: Object, validator(value){ return isMatch(change, value);} }
	},
	emits:
	{
		[updateText]: function(payload){ return typeof payload === 'string' },
		[updateApply]: function(payload){ return typeof payload === 'boolean' },
	},
	computed:
	{
		isDisabled()
		{
			return this.change == null;
		},
		isApply()
		{
			return this.change?.apply;
		},
		getText()
		{
			return this.change?.apply ? this.change.text : this.line.text;
		}
	},
	methods:
	{
		onUpdateText(e)
		{
			const text = e.target.value;
			this.$emit(updateText, text);
		},
		onChangeApply(e)
		{
			const apply = e.target.checked;
			this.$emit(updateApply, apply);
		}
	}
}
</script>

<style lang="scss" scoped>
.line
{
	display: flex;
	flex-flow: row nowrap;
}
.line-checkbox
{
	margin: 12px 0px 10px 10px;
}
.line-text
{
	flex: 1 0 0;
	margin: 3px 10px 3px 3px;
	font: 16px / 24px var(--font);
}
</style>
