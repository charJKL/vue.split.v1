<template>
<section ref="list" class="list" @wheel.prevent="onMouseWheel">
	<editor-thumbnail v-for="(record, index) in getList" :key="index" :source="record.source" :metrics="record.metrics" @click="selectIndex(index)"/>
</section>
</template>

<script>
import EditorThumbnail from './EditorThumbnail';
import {selectIndex} from '../store/records';

export default
{
	components: { EditorThumbnail },
	data()
	{
		return {};
	},
	computed:
	{
		getList()
		{
			return this.$store.getters.list;
		}
	},
	methods:
	{
		selectIndex(index)
		{
			this.$store.dispatch(selectIndex, index);
		},
		onMouseWheel(e)
		{
			this.$refs.list.scrollLeft += e.deltaY;
		}
	}
}
</script>

<style scoped>
.list
{
	flex: 0 0 auto;
	display: flex;
	flex-flow: row nowrap;
	overflow-x: scroll;
	padding: 10px;
	height: 117px;
	background: var(--gray-light);
}
</style>
