<template>
<section ref="list" class="list" @wheel.prevent="onMouseWheel">
	<ui-list-image v-for="(record, index) in getList" :key="index" :record="record" @click="selectIndex(index)"/>
</section>
</template>

<script>
import UiListImage from './UiListImage';
import {selectIndex} from '../store.js';

export default
{
	components: { UiListImage },
	computed:
	{
		getList()
		{
			return this.$store.getters.getList;
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
