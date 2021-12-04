import {Status} from '../../lib/Status';
import {createWorker} from 'tesseract.js';

export const ParseJobStatus = {Idle: 'Idle', Active: 'Active', Completed: 'Completed', Terminated: 'Terminated'};

function ParseJob(store, state, id)
{
	this.store = store;
	this.state = state;
	this.id = id;
	this.status = ParseJobStatus.Idle;
	this.worker = null;
}
ParseJob.prototype.parameters = {
	user_defined_dpi: '96',
	tessjs_create_hocr: '0',
	tessjs_create_tsv: '0',
	tessjs_create_box: '0',
	tessjs_create_unlv: '0',
	tessjs_create_osd: '0'
};
ParseJob.prototype.run = async function()
{
	if(this.status === ParseJobStatus.Active) return Promise.reject('You cant run active job.');
	if(this.status === ParseJobStatus.Completed) return Promise.reject('You cant run again completed job.');
	if(this.status === ParseJobStatus.Terminated) return Promise.reject('You cant run terminated job.');
	
	const cropped = this.state.records.records.get(this.id).cropped;
	const ocr = this.state.records.records.get(this.id).ocr;
	
	// Create web worker:
	this.status = ParseJobStatus.Active;
	this.worker = createWorker({
		workerPath: '/worker.min.js',
		langPath: '/',
		corePath: '/tesseract-core.wasm.js',
		logger: this.log.bind(this),
		errorHandler: this.terminate.bind(this),
	});
	
	// Update ocr stage status:
	ocr.status = Status.Working;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
	
	// Prepare tesseract web worker:
	await this.worker.load();
	await this.worker.loadLanguage('eng+pol');
	await this.worker.initialize('pol');
	await this.worker.setParameters(this.parameters);
	
	// Execute tesseract recognition:
	cropped.blob.name = 'some fake name'; // there is a bug in tesseract which require that blob should have name property.
	const result = await this.worker.recognize(cropped.blob);
	
	// Update ocr stage status and save results:
	ocr.status = Status.Completed;
	ocr.lines = [...result.data.lines];
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
	
	// Remove worker:
	this.status = ParseJobStatus.Completed;
	await this.worker.terminate();
	return Promise.resolve(true);
}
ParseJob.prototype.log = function()
{
	const ocr = this.state.records.records.get(this.id).ocr;
	ocr.status = Status.Working;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
}
ParseJob.prototype.terminate = function()
{
	if(this.status === ParseJobStatus.Active)
	{
		this.status = ParseJobStatus.Terminated;
		this.worker.terminate();
	}
	
	const ocr = this.state.records.records.get(this.id).ocr;
	ocr.status = Status.Dirty;
	this.store.commit('ocr', {id: this.id, value: {...ocr}});
}
ParseJob.prototype.isIdle = function()
{
	return this.status == ParseJobStatus.Idle;
}
ParseJob.prototype.isActive = function()
{
	return this.status == ParseJobStatus.Active;
}
ParseJob.prototype.isTerminated = function()
{
	return this.status == ParseJobStatus.Terminated;
}

export default ParseJob;