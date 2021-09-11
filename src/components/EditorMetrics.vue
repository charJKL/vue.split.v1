<template>
<div id="editor" ref="editor">
	<div class="desktop" v-if="isCurrent">
		<img class="image" :src="getCurrentUrl" />
		<svg class="canvas">
			<template v-for="(metric, name) in metrics" :key="name">
				<editor-metrics-line v-if="metric.type === 'line'" :type="metric.subtype" :name="name" :value="metric.value" />
			</template>
			<path d="M 0,0 M 100%,0 M 100%,100% M 0,100% z" fill-rule="evenodd" fill="blue" stroke="black" stroke-width="3" />
		</svg>
	</div>
</div>
</template>

<script>
import EditorMetricsLine from './EditorMetricsLine';
import Record from './Record';

//import _ from 'lodash';

export default
{
	components: { EditorMetricsLine },
	data()
	{
		return {
			metrics: Record.metrics,
		}
	},
	computed:
	{
		isCurrent()
		{
			return this.$store.getters.getCurrent !== null;
		},
		current()
		{
			return this.$store.getters.getCurrent;
		},
		getCurrentUrl()
		{
			return this.$store.getters.getCurrent.source.url;
		},
	},
	watch:
	{
		current(value)
		{
			console.log('current changes', value);
		}
	},
	methods:
	{
		
	},
}
</script>

<style scoped>
#editor
{
	flex: 1 0 0;
	display:flex;
	justify-content: center;
	align-items: center;
	background: red;
}
.desktop
{
	position: relative;
	width: 500px;
	height: 500px;
	border: solid 1px #000;
}
.image
{
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
}
.canvas
{
	position: absolute;
	top: -2%; left: -2%;
	z-index: 2;
	width: 104%;
	height: 104%;
	background: yellow;
	opacity: 0.5;
}
</style>
