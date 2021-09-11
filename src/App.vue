<template>
	<ui-header></ui-header>
	<ui-list></ui-list>
	<editor-metrics></editor-metrics>
	<ui-footer></ui-footer>
	<a ref="download" style="display:none"/>
</template>

<script>
import UiHeader from './components/UiHeader';
import UiList from './components/UiList';
import EditorMetrics from './components/EditorMetrics';
import UiFooter from './components/UiFooter';
import _ from 'lodash';

export default 
{
	components: { UiHeader, UiList, EditorMetrics, UiFooter },
	name: 'App',
	computed:
	{
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		}
	},
	methods:
	{
		onLoadSave(save)
		{
			function applySavedList(e)
			{
				const data = JSON.parse(e.target.result);
				for(let [object, key] of Object.entries(data))
				{
					if(this.list[key] === undefined) continue;
					this.list[key] = _.mergeWith(this.list[key], object);
				}
			}
			const reader = new FileReader();
					reader.onload = applySavedList.bind(this);
					reader.readAsText(save);
		},
		onCurrentEdited()
		{
			this.current.wasEdited = true;
		},
		onApplyBlueprint(blueprint)
		{
			for(let [name, value] of Object.entries(this.list))
			{
				if(value.wasEdited === true) continue;
				if(name.match(blueprint.regexp) === null) continue;
				this.list[name].metrics = _.cloneDeep(blueprint.metrics);
			}
		},
		onSave()
		{
			const content = JSON.stringify(this.list);
			const blob = new Blob([content], { type: "application/json" });
			
			this.$refs.download.href = URL.createObjectURL(blob);
			this.$refs.download.download = 'metrics.json';
			this.$refs.download.click();
		}
	}
}
</script>

<style>
:root
{
	--font: 'Arial';
	--gray: rgba(200,200,200,1);
	--gray-light: rgba(220,220,220,1);
}
html
{
	height: 100%;
	max-height: 100%;
}
body
{
	height: 100%;
	max-height: 100%;
	padding: 0px;
	margin: 0px;
}
#app
{
	display: flex;
	flex-flow: column nowrap;
	height: 100%;
	max-height: 100%;
	overflow-y: none;
}
button
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
button:last-child{ margin: 0px 0px 0px 5px; }
button:first-child{ margin: 0px 5px 0px 0px; }
.input-text
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
}
.input-float,
.input-int
{
	padding: 3px 5px;
	margin: 0px 5px;
	font: 16px / 20px var(--font);
	width: 100px;
}
.input-checkbox
{
	position: relative;
	top: 3px;
	height: 20px;
	width: 25px;
	margin: 0px;
	padding: 0px;
}
</style>