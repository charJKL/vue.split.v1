<template>
<div class="editor-default editor-default-collapsed" v-if="isDefaultHided">
	<div class="line-first">
		<toggle-button class="button-toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
	</div>
</div>
<div class="editor-default editor-default-showed" v-if="isDefaultShowed">
	<div class="line-first">
		<toggle-button class="toggle" v-model="show" on="Show defaults" off="Show defaults"></toggle-button>
		<button class="add" @click="onAdd">Add</button>
	</div>
	<template v-for="(blueprint, index) in blueprints" :key="index">
		<div class="line" @mousemove="onMousemoveBlueprint(blueprint)" @focusin="onFocusinBlueprint(blueprint)" @focusout="onFocusoutBlueprint(null)" @mouseleave="onMouseleaveBlueprint(null)">
			<editor-input v-model:source="blueprint.source" v-model:metrics="blueprint.metrics" :inputs="blueprint.inputs" @update:source="onUpdateSource(blueprint, $event)"></editor-input>
			<button class="copy" @click="onCopy(blueprint)" :disabled="disableCopyAction">Copy from metrics</button>
			<button class="apply" @click="onApply(blueprint)" >Apply</button>
			<button class="delete" @click="onDelete(blueprint)">Delete</button>
		</div>
	</template>
</div>
</template>

<script>
import ToggleButton from './utils/ToggleButton';
import EditorInput, {inputs} from './EditorInput';
import {record, loadDefault} from '../store/records';
import {setSearching, setBlueprint} from '../store/ui';
import {cloneDeep} from 'lodash';
import {mapGetters} from 'vuex';

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
		...mapGetters(['list', 'current']),
		isDefaultShowed()
		{
			return this.show === true;
		},
		isDefaultHided()
		{
			return this.show === false;
		},
		disableCopyAction()
		{
			return this.current !== null;
		}
	},
	created()
	{
		this.onAdd();
	},
	methods:
	{
		onUpdateSource(blueprint, source)
		{
			this.$store.dispatch(setSearching, source.filename).then(function(result){
				blueprint.inputs.source.invalid = (result instanceof Error) ? result.message : '';
			});
		},
		onFocusinBlueprint(blueprint)
		{
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onFocusoutBlueprint(blueprint)
		{
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onMousemoveBlueprint(blueprint)
		{
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onMouseleaveBlueprint(blueprint)
		{
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onAdd()
		{
			const blueprint = {};
					blueprint.source = cloneDeep(record.source);
					blueprint.metrics = cloneDeep(record.metrics);
					blueprint.inputs = cloneDeep(inputs);
			this.blueprints.push(blueprint);
		},
		onCopy(blueprint)
		{
			if(this.current === null) return;
			blueprint.metrics = cloneDeep(this.current.metrics);
		},
		onApply(blueprint)
		{
			console.log('blueprint-apply', blueprint.source, blueprint.metrics);
			this.$store.dispatch(loadDefault, blueprint);
		},
		onDelete(blueprint)
		{
			const index = this.blueprints.indexOf(blueprint);
			this.blueprints.splice(index, 1);
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
button
{
	box-sizing: border-box;
	height: 30px;
}
.toggle
{
	box-sizing: border-box;
	height: 30px;
}
.line-first
{
	margin: 10px 10px;
}
.line
{
	display: flex;
	flex-flow: row nowrap;
	margin: 5px 10px 10px 10px;
}
.add
{
	margin: 0px 0px 0px 5px;
}
.copy
{
	margin: 0px 0px 0px 10px;
}
.apply
{
	margin: 0px 0px 0px 5px;
}
.delete
{
	margin: 0px 0px 0px auto;
}
</style>

