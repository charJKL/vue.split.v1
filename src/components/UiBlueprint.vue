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
	<template v-for="[key, draft] of drafts" :key="key">
		<div class="line" @mousemove="onMousemoveLine(key, draft)" @focusin="onFocusinLine(key, draft)" @mouseleave="onMouseleaveLine(null, null)" @focusout="onFocusoutLine(null, null)">
			<editor-input v-model:source="draft.source" v-model:metrics="draft.metrics" @update:source="onUpdateSource(draft, $event)" @update:metrics="onUpdateMetrics(draft, $event)" />
			<button class="copy" @click="onCopy(key, draft)" :disabled="isDisabledCopyAction">Copy from metrics</button>
			<button class="apply" @click="onApply(key, draft)">Apply</button>
			<button class="delete" @click="onDelete(key, draft)">Delete</button>
		</div>
	</template>
</div>
</template>

<script>
import ToggleButton from './commons/ToggleButton';
import EditorInput from './EditorInput';
import UiBlueprintMouse from './UiBlueprintMouse';
import {blueprint} from '../store/records';
import {storeBlueprint, applyBlueprint} from '../store/records';
import {setSearching} from '../store/ui';
import {mapGetters} from 'vuex';
import {clone} from '../lib/clone';

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
				this.drafts = clone(blueprints);
			}
		}
	},
	created()
	{
		if(this.drafts.size === 0) this.drafts.insert(blueprint);
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
				this.updateBlueprints();
			}catch(e)
			{
				draft.source.errors.invalidRegexp = e.message;
				this.$store.dispatch(setSearching, null);
			}
		},
		onUpdateMetrics()
		{
			this.updateBlueprints();
		},
		updateBlueprints()
		{
			this.$store.dispatch(storeBlueprint, this.drafts);
		},
		onAdd()
		{
			this.drafts.insert(blueprint);
			this.updateBlueprints();
		},
		onApply(key, draft)
		{
			this.$store.dispatch(applyBlueprint, draft);
		},
		onCopy(key, draft)
		{
			if(this.current === null) return;
			draft.metrics = clone(this.current.metrics);
			this.updateBlueprints();
		},
		onDelete(key)
		{
			this.drafts.delete(key);
			this.updateBlueprints();
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
