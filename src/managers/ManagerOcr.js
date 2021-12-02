import {Status} from '../store/records';
//import {debounce} from 'lodash';
import {createWorker} from 'tesseract.js';

const queue = [];

function ManagerOcr(store)
{
	const worker = createWorker({
		workerPath: '/worker.min.js',
		langPath: '/',
		corePath: '/tesseract-core.wasm.js',
		logger: m => console.log('tesseract logging:', m),
		errorHandler: error => console.error('tesseract error:', error)
	})
	const isTesseractReady = initTesseract(worker);

	//const doCropImageWork = debounce(cropImage, 200, {leading: false, trailing: true});
	
	store.subscribe(function(mutation, state){
		if(mutation.type == 'selected') selectedChanged(store, state, mutation);
		if(mutation.type == 'cropped') croppedChanged(store, state, mutation);
	});
	
	function selectedChanged(store, state, mutation)
	{
		const id = mutation.payload;
		parseImage(store)
		console.log('ocr selected changes', id);
	}
	
	function croppedChanged(store, state, mutation)
	{
		const id = mutation.payload.id;
		const cropped = state.records.records.get(id).cropped;
		if(cropped.status != Status.Done) return;
		console.log('ocr cropped changes', id);
		if(working === true) return;
		parseImage(store, state, id);
	}
	
	function parseImage(store, state, id)
	{
		isTesseractReady.then(async function(){
			const cropped = state.records.records.get(id).cropped;
			//const ocr = state.records.records.get(id).ocr;
			working = true;
			console.log('parseImage for', id);
			cropped.blob.name = 'some fake name'; // there is a bug in tesseract which require that blob should have name property.
			const result = await worker.recognize(cropped.blob);
			console.log(result);
			working = false;
		});
	}
}

async function initTesseract(worker)
{
	await worker.load();
	await worker.loadLanguage('eng+pol');
	await worker.initialize('pol');
	await worker.setParameters({
		user_defined_dpi: '96',
		tessjs_create_hocr: '0',
		tessjs_create_tsv: '0',
		tessjs_create_box: '0',
		tessjs_create_unlv: '0',
		tessjs_create_osd: '0'
	});
}


export default ManagerOcr;