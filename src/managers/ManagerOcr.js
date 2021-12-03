import {Status} from '../lib/Status';
//import {debounce} from 'lodash';
import {createWorker} from 'tesseract.js';

var isWorking = false;
const queue = [];

function ManagerOcr(store)
{
	const worker = createWorker({
		workerPath: '/worker.min.js',
		langPath: '/',
		corePath: '/tesseract-core.wasm.js',
		logger: parseImageProgress.bind(null, store),
		errorHandler: error => console.error('tesseract error:', error)
	})
	const isTesseractReady = initTesseract(worker);

	store.subscribe(filterMutations);
	
	function filterMutations(mutation, state)
	{
		if(mutation.type == 'selected' && mutation.payload !== null)
		{
			selectedChanged(store, state, mutation);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Dirty)
		{
			croppedChangedToDirty(store, state, mutation);
			return;
		}
		if(mutation.type == 'cropped' && mutation.payload.value.status === Status.Done)
		{
			croppedChangedToDone(store, state, mutation);
			return;
		}
	}
	
	function selectedChanged(store, state, mutation)
	{
		const id = mutation.payload;
		const cropped = state.records.records.get(id).cropped;
		const ocr = state.records.records.get(id).ocr;
		if(cropped.status !== Status.Done) return; // cropped data is not ready yet.
		if(ocr.status > Status.Dirty) return; // cord data is already done or in process.
		
		ocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: {...ocr}});
		queue.push(parseImage.bind(this, store, state, id));
		doParseImage();
	}
	
	function croppedChangedToDirty(store, state, mutation)
	{
		const id = mutation.payload.id;
		const ocr = state.records.records.get(id).ocr;
		
		// Cropped values changes hence current result are dirty, not valid anymore:
		ocr.status = Status.Dirty;
		store.commit('ocr', {id: id, value: {...ocr}});
	}
	
	function croppedChangedToDone(store, state, mutation)
	{
		const id = mutation.payload.id;
		const ocr = state.records.records.get(id).ocr;

		ocr.status = Status.Queued;
		store.commit('ocr', {id: id, value: {...ocr}});
		queue.push(parseImage.bind(this, store, state, id));
		doParseImage();
	}
	
	function doParseImage()
	{
		if(isWorking === true) return;
		queue.shift()?.call();
	}
	
	function parseImage(store, state, id)
	{
		isWorking = true;
		isTesseractReady.then(async function(){
			const cropped = state.records.records.get(id).cropped;
			const ocr = state.records.records.get(id).ocr;
			ocr.status = Status.Working;
			store.commit('ocr', {id: id, value: {...ocr}});
			
			//const ocr = state.records.records.get(id).ocr;
			cropped.blob.name = 'some fake name'; // there is a bug in tesseract which require that blob should have name property.
			const result = await worker.recognize(cropped.blob, {}, id);
			console.log(result);
			
			ocr.status = Status.Done;
			ocr.lines = [...result.data.lines];
			store.commit('ocr', {id: id, value: {...ocr}});
			isWorking = false;
			doParseImage();
		});
	}
	
	function parseImageProgress(store, e)
	{
		console.log(store);
		if(e.status !== "recognizing text") return;
		
		const id = e.userJobId;
		console.log(store, id);
		//const ocr = 
		//ocr.info = e.progress;
		//store.commit('ocr', {id: id, value: {...ocr}});
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