<template>
<div>
	<input class="line-checkbox" type="checkbox" :checked="isApply" :disabled="isDisabled" @change="onChangeApply"/>
	<label><input class="line-checkbox" type="checkbox" :checked="isHeader"  @change="onChangeHeader"/>H</label>
	<label><input class="line-checkbox" type="checkbox" :checked="isParagraph"  @change="onChangeParagraph"/>P</label>
	<label><input class="line-checkbox" type="checkbox" :checked="isQuote"  @change="onChangeQuote"/>Q</label>
	<label><input class="line-checkbox" type="checkbox" :checked="isImage"  @change="onChangeImage"/>I</label>
	<input class="line-text" :value="getText" @input="onUpdateText" />
</div>
</template>

<script>
import {line, change} from '../../store/records';
import {isMatch} from '../../lib/isMatch';

export const updateText = 'update:text';
export const updateApply = 'update:apply';
export const updateHeader = 'update:header';
export const updateParagraph = 'update:paragraph';
export const updateQuote = 'update:quote';
export const updateImage = 'update:image';

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
		[updateHeader]: function(payload){ return typeof payload === 'boolean' },
		[updateParagraph]: function(payload){ return typeof payload === 'boolean' },
		[updateQuote]: function(payload){ return typeof payload === 'boolean' },
		[updateImage]: function(payload){ return typeof payload === 'boolean' },
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
		isHeader()
		{
			return this.change?.header;
		},
		isParagraph()
		{
			return this.change?.paragraph;
		},
		isQuote()
		{
			return this.change?.quote;
		},
		isImage()
		{
			return this.change?.image;
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
		},
		onChangeHeader(e)
		{
			const header = e.target.checked;
			this.$emit(updateHeader, header);
		},
		onChangeParagraph(e)
		{
			const paragraph = e.target.checked;
			this.$emit(updateParagraph, paragraph);
		},
		onChangeQuote(e)
		{
			const quote = e.target.checked;
			this.$emit(updateQuote, quote);
		},
		onChangeImage(e)
		{
			const image = e.target.checked;
			this.$emit(updateImage, image);
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
