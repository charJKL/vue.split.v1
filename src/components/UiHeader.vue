<template>
<header class="header">
	<button class="load-files" @click="this.$refs.loadImagesFiles.click()">Load files</button>
	<input class="file-list" type="text" :value="getList" @click="this.$refs.loadImagesFiles.click()" readonly />
	<input class="input-hide" ref="loadImagesFiles" @change="onLoadImagesFiles" type="file" accept="image/*" multiple />
	
	<button :class="['stage-metrics', getStageMetricsClasses]" @click="onStageMetrics">1.Metrics - 2.Preview</button>
	<button :class="['stage-text', getStageTextClasses]" @click="onStageText">3.Adjust - 4.Result</button>
</header>
</template>

<script>
import {loadImagesFiles} from '../store/records';
import {Stage, setStage} from '../store/ui';
import {mapGetters} from 'vuex';

export default
{
	computed:
	{
		...mapGetters(['records']),
		...mapGetters(['stage']),
		getStageMetricsClasses()
		{
			const isActive = this.stage === Stage.Metrics ? 'is-active' : '';
			return [isActive];
		},
		getStageTextClasses()
		{
			const isActive = this.stage === Stage.Text ? 'is-active' : '';
			return [isActive];
		},
		getList()
		{
			return this.records.flatMap(file => file.source.filename);
		}
	},
	methods: 
	{
		onLoadImagesFiles(e)
		{
			this.$store.dispatch(loadImagesFiles, Array.from(e.target.files));
		},
		onStageMetrics()
		{
			this.$store.dispatch(setStage, Stage.Metrics);
		},
		onStageText()
		{
			this.$store.dispatch(setStage, Stage.Text);
		}
	}
}
</script>

<style scoped>
.header
{
	display: flex;
	flex-flow: row nowrap;
	background: var(--gray);
}
input
{
	box-sizing: border-box;
	height: 30px;
	margin: 10px 0px 10px 0px;
}
button
{
	box-sizing: border-box;
	height: 30px;
	margin: 10px 0px 10px 0px;
}
.load-files
{
	margin-left: 10px;
}
.stage-metrics
{
	margin-left: 50px;
}
.stage-text
{
	margin-left: 5px;
}
.is-active
{
	outline: solid 1px red;
}
.input-hide
{
	display: none;
}
.file-list
{
	width: 350px;
}
</style>