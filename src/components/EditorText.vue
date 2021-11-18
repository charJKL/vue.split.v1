<template>
<div>
	Editor text.
</div>
</template>

<script>
import {isMatch} from '../lib/isMatch';
import {record} from '../store/records';
import {createWorker} from 'tesseract.js';

export default
{
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
		//cropp: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
	},
	data()
	{
		return {
			mounted: false
		}
	},
	watch:
	{
		source()
		{
			this.readText();
		}
	},
	methods:
	{
		readText()
		{
			console.log('execute tesseract');
			
			const worker = createWorker({
				workerPath: '/worker.min.js',
				langPath: '/',
				corePath: '/tesseract-core.wasm.js',
				logger: m => console.log(m)
			});

				(async () => {
				await worker.load();
				await worker.loadLanguage('eng');
				await worker.initialize('eng');
				const { data: { text } } = await worker.recognize('/eng_bw.png');
				console.log(text);
				await worker.terminate();
				})();

			console.log("read text process");
			
		}
	}
}
</script>

<style scoped>
.editor
{
	position:relative;
}
</style>