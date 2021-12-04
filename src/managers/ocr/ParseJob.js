import {createWorker} from 'tesseract.js';
/* eslint-disable */
const ParseJobStatus = {Idle: 'Idle', Active: 'Active', Ended: 'Ended'};
const ParseJobEvents = {initialization: 'initialization', recognize: 'recognize', interrupted: 'interrupted', done: 'done', ended: 'ended'};

class ParseJob
{
	#blob = null;
	#status = ParseJobStatus.Idle;
	#interrupted = false;
	#worker = null;
	#listeners = {
		[ParseJobEvents.initialization]: [],
		[ParseJobEvents.recognize]: [],
		[ParseJobEvents.interrupted]: [],
		[ParseJobEvents.done]: [],
		[ParseJobEvents.ended]: []
	}
	
	static #parameters = {
		user_defined_dpi: '96',
		tessjs_create_hocr: '0',
		tessjs_create_tsv: '0',
		tessjs_create_box: '0',
		tessjs_create_unlv: '0',
		tessjs_create_osd: '0'
	};
	
	get status()
	{
		return this.#status;
	}
	
	get id()
	{
		return this.#worker?.id;
	}
	
	constructor(blob)
	{
		if(!(blob instanceof Blob)) throw new Error(`ParseJob take blob as data.`);

		this.#blob = blob;
		this.#blob.name = 'some-string'; // there is a bug in tesseract which require that blob should have name property.
	}
	
	addEventListener(type, listener)
	{
		if(Object.prototype.hasOwnProperty.call(this.#listeners, type) === false) throw new Error(`ParseJob doesnt support '${type}' event.`, ParseJob);
		this.#listeners[type].push(listener);
	}
	
	dispatchEvent(type, data)
	{
		if(Object.prototype.hasOwnProperty.call(this.#listeners, type) === false) throw new Error(`You can't dispatch '${type}' event on ParseJob.`, ParseJob);
		for(const listener of this.#listeners[type])
		{
			listener.call(this, data);
		}
	}
	
	async run()
	{
		if(this.#status === ParseJobStatus.Active) throw new Error(`This ParseJob is active. You can't run it again.`, this);
		if(this.#status === ParseJobStatus.Ended) throw new Error(`This ParseJob ended. You can't run it again.`, this);
		
		this.#status = ParseJobStatus.Active;
		this.#worker = createWorker({
			workerPath: '/worker.min.js',
			langPath: '/',
			corePath: '/tesseract-core.wasm.js',
			logger: this.#log.bind(this),
			errorHandler: this.#handler.bind(this),
		});
		
		await this.#worker.load();
		await this.#worker.loadLanguage('eng+pol');
		await this.#worker.initialize('pol');
		await this.#worker.setParameters(ParseJob.#parameters);
		const result = await this.#worker.recognize(this.#blob);
		this.dispatchEvent(ParseJobEvents.done, result.data);
		this.#status = ParseJobStatus.Ended;
		this.dispatchEvent(ParseJobEvents.ended);
		await this.#worker.terminate();
	}
	
	async terminate(cause)
	{
		this.#worker?.terminate();
		this.#interrupted = true;
		this.dispatchEvent(ParseJobEvents.interrupted, cause);
		this.#status = ParseJobStatus.Ended;
		this.dispatchEvent(ParseJobEvents.ended);
	}
	
	isIdle()
	{
		return this.#status === ParseJobStatus.Idle;
	}
	
	isActive()
	{
		return this.#status === ParseJobStatus.Active;
	}
	
	isEnded()
	{
		return this.#status === ParseJobStatus.Ended;
	}
	
	wasInterrupted()
	{
		return this.#interrupted;
	}
	
	#log(log)
	{
		switch(String(log.status))
		{
			case "loading tesseract core":
			case "initializing tesseract":
			case "initialized tesseract":
			case "loading language traineddata":
			case "loaded language traineddata":
			case "initializing api":
			case "initialized api":
				this.dispatchEvent(ParseJobEvents.initialization, log.status);
				return;
			
			case "recognizing text":
				this.dispatchEvent(ParseJobEvents.recognize, log.progress);
				return;
			
			default:
				console.warn('Uncatch tesseract log:', log);
				return;
		}
	}
	
	#handler(cause) // eslint-disable-line no-dupe-class-members
	{
		this.terminate(cause);
	}
}

export default ParseJob;