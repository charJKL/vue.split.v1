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
		cropped: { type: Object, validator(value){ return isMatch(record.cropped, value); } },
	},
	data()
	{
		return {
			mounted: false
		}
	},
	watch:
	{
		cropped()
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
			
			const data = this.cropped;
			console.log(data.blob);
			data.blob.name = 'ssss';
			console.log(data.data);
				(async () => {
				await worker.load();
				await worker.loadLanguage('eng');
				await worker.initialize('eng');
				const { data: { text } } = await worker.recognize(data.blob);
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