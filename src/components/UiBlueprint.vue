<template>
<div class="blueprint blueprint-hide" v-if="isHide">
	<div class="line line-first">
		<toggle-button class="toggle" v-model="show" on="Show blueprints" off="Show blueprints" />
	</div>
</div>
<div class="blueprint blueprint-show" v-if="isShow">
	<div class="line line-first">
		<toggle-button class="toggle" v-model="show" on="Show blueprints" off="Show blueprints" />
		<button class="add" @click="onAdd">Add</button>
	</div>
	<template v-for="(draft, index) of drafts" :key="index">
		<div class="line" @mouseenter="onMouseenterLine(draft)" @focusin="onFocusinLine(draft)" @mouseleave="onMouseleaveLine(null, null)" @focusout="onFocusoutLine(null, null)">
			<editor-input v-model:source="draft.source" v-model:metrics="draft.metrics" @update:source="onUpdateSource(draft, $event)" @update:metrics="onUpdateMetrics(draft, $event)" />
			<button class="copy" @click="onCopy(draft)" :disabled="isDisabledCopyAction">Copy from metrics</button>
			<button class="apply" @click="onApply(draft)">Apply</button>
			<button class="delete" @click="onDelete(draft)">Delete</button>
		</div>
	</template>
</div>
</template>

<script>
import ToggleButton from './commons/ToggleButton';
import EditorInput from './editor/EditorInput';
import UiBlueprintMouse from './UiBlueprintMouse';
import {addBlueprint, updateBlueprint, removeBlueprint} from '../store/blueprints';
import {applyBlueprint} from '../store/records';
import {setSearching} from '../store/ui';
import {getDeepCopy} from '../lib/getDeepCopy';
import {mapGetters} from 'vuex';



export default
{
	components: { ToggleButton, EditorInput },
	mixins: [ UiBlueprintMouse ],
	data()
	{
		return {
			show: false,
			drafts: null,
		}
	},
	computed:
	{
		...mapGetters(['blueprints', 'current']),
		isShow()
		{
			return this.show === true;
		},
		isHide()
		{
			return this.show === false;
		},
		isDisabledCopyAction()
		{
			return this.current === null;
		}
	},
	watch:
	{
		blueprints: {
			immediate: true,
			handler(blueprints)
			{
				this.drafts = getDeepCopy(blueprints);
			}
		}
	},
	created()
	{
		if(this.drafts.length === 0) this.onAdd();
	},
	methods:
	{
		onUpdateSource(draft, source)
		{
			try
			{
				draft.regexp = new RegExp(source.filename, 'g');
				draft.source.errors.invalidRegexp = '';
				this.$store.dispatch(setSearching, draft.regexp);
				this.$store.dispatch(updateBlueprint, draft);
			}catch(e)
			{
				draft.source.errors.invalidRegexp = e.message;
				this.$store.dispatch(setSearching, null);
			}
		},
		onUpdateMetrics(draft)
		{
			this.$store.dispatch(updateBlueprint, draft);
		},
		onAdd()
		{
			this.$store.dispatch(addBlueprint);
		},
		onApply(draft)
		{
			this.$store.dispatch(applyBlueprint, draft);
		},
		onCopy(draft)
		{
			if(this.current === null) return;
			draft.metrics = getDeepCopy(this.current.metrics);
		},
		onDelete(draft)
		{
			this.$store.dispatch(removeBlueprint, draft);
		}
	}
}
</script>

<style scoped>
.blueprint
{
	position:absolute;
	top: 0px; 
	left: 0px;
	z-index: 5;
}
.blueprint-hide
{
	
}
.blueprint-show
{
	width: 100%;
	background: var(--gray-light);
}
.line
{
	display: flex;
	flex-flow: row nowrap;
	margin: 5px 10px 10px 10px;
}
.line-first
{
	margin: 10px 10px;
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
