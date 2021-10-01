<template>
<header class="header">
	<div class="header-left">
		<span>
			<button @click="this.$refs.loadSave.click()">Load save</button>
			<input class="hide-input" ref="loadSave" @change="onLoadSave" type="file" accept=".json" />
		</span>
		<span>
			<button @click="this.$refs.loadFiles.click()">Load files</button>
			<input class="hide-input" ref="loadFiles" @change="onLoadFiles" type="file" accept="image/*" multiple />
			<input class="input-text" type="text" :value="getList" readonly />
		</span>
	</div>
</header>
</template>

<script>
import {loadSave, loadList} from '../store/records';

export default
{
	computed:
	{
		getList()
		{
			return this.$store.getters.getList.flatMap(file => file.source.filename);
		}
	},
	methods: 
	{
		onLoadSave(e)
		{
			this.$store.dispath(loadSave, e.target.files[0]);
		},
		onLoadFiles(e)
		{
			this.$store.dispatch(loadList, Array.from(e.target.files));
		}
	}
}
</script>

<style scoped>
.header
{
	flex: 0 0 auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	padding: 10px;
	background: var(--gray);
}
.hide-input
{
	display: none;
}
.input-text
{
	width: 450px;
}
</style>