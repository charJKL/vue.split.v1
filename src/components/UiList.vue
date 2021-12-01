<template>
<section ref="list" class="list" @wheel.prevent="onMouseWheel">
	<editor-thumbnail v-for="(record, index) in records" :key="index" :source="record.source" :metrics="record.metrics" @click="onClickRecord(record)"/>
</section>
</template>

<script>
import EditorThumbnail from './editor/EditorThumbnail';
import {selectRecord} from '../store/records';
import {mapGetters} from 'vuex';

export default
{
	components: { EditorThumbnail },
	data()
	{
		return {};
	},
	computed:
	{
		...mapGetters(['records']),
	},
	methods:
	{
		onClickRecord(record)
		{
			this.$store.dispatch(selectRecord, record);
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
	height: 127px;
	background: var(--gray-light);
}
</style>
