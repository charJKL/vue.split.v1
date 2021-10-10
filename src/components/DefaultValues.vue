<template>
<div class="editor-default editor-default-collapsed" v-if="show === false">
	<div class="line-first">
		<toggle-button class="button-toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
	</div>
</div>
<div class="editor-default editor-default-showed" v-else>
	<div class="line-first">
		<toggle-button class="button-toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
		<button @click="onAdd">Add</button>
	</div>
	<template v-for="(blueprint, index) in blueprints" :key="index">
		<div class="line">
			<editor-input v-model:source="blueprint.source" v-model:metrics="blueprint.metrics" ></editor-input>
			<button @click="onCopy(blueprint)" :disabled="disableCopyAction">Copy from metrics</button>
			<button @click="onApply(blueprint)" >Apply</button>
		</div>
	</template>
</div>
</template>

<script>
import ToggleButton from './utils/ToggleButton';
import EditorInput from './EditorInput';
import {record, loadDefault} from '../store/records';
import {cloneDeep} from 'lodash';

export default
{
	components: { ToggleButton, EditorInput },
	data()
	{
		return {
			blueprints: [],
			show: false,
		}
	},
	computed:
	{
		list()
		{
			return this.$store.getters.getList;
		},
		current()
		{
			return this.$store.getters.getCurrent;
		},
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		},
		disableCopyAction()
		{
			return this.isCurrent === false;
		}
	},
	created()
	{
		this.onAdd();
	},
	methods:
	{
		onAdd()
		{
			const blueprint = {};
					blueprint.source = cloneDeep(record.source);
					blueprint.metrics = cloneDeep(record.metrics);
			this.blueprints.push(blueprint);
		},
		onCopy(blueprint)
		{
			if(this.isCurrent === false) return;
			blueprint.metrics = cloneDeep(this.current.metrics);
		},
		onApply(blueprint)
		{
			this.$store.dispatch(loadDefault, blueprint);
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
.line-first
{
	margin: 10px 10px;
}
.line
{
	margin: 5px 10px 10px 10px;
}
</style>

