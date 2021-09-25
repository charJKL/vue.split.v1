<template>
<div class="editor-default editor-default-collapsed" v-if="show === false">
	<toggle-button class="button-toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
</div>
<div class="editor-default editor-default-showed" v-else>
	<div class="">
		<toggle-button class="button-toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
		<button @click="onAdd">Add</button>
	</div>
	<div v-for="(blueprint, index) in list" :key="index">
		<editor-input :metrics="blueprint" @update:metrics="onBlueprintUpdate"></editor-input>
		<button @click="onApply(blueprint)" >Apply</button>
	</div>
</div>
</template>

<script>
import ToggleButton from './utils/ToggleButton';
import EditorInput from './EditorInput';
import Record from './Record';
import {cloneDeep} from 'lodash';

export default
{
	components: { ToggleButton, EditorInput },
	emits: ['apply'],
	data()
	{
		return {
			list: [],
			show: false,
		}
	},
	created()
	{
		this.onAdd();
	},
	methods:
	{
		onBlueprintUpdate(blueprint)
		{
			console.log('onBlueprintUpdate', blueprint);
		},
		onAdd()
		{
			this.list.unshift(cloneDeep(Record.metrics));
		},
		onApply(blueprint)
		{
			this.$emit('apply', blueprint);
		}
	}
}
</script>

<style scoped>
.editor-default
{
	position:absolute;
	top: 0px; 
	left: 0px;
	z-index: 5;
}
.editor-default-collapsed
{
	
}
.editor-default-showed
{
	width: 100%;
	background: var(--gray-light);
}
.button-toggle
{
	margin: 10px;
}
</style>

