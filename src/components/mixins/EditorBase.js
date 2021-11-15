import {isMatch} from '../../lib/isMatch';
import {record} from '../../store/records';
import {cloneDeep} from 'lodash';

export const updateSource = 'update:source';
export const updateMetrics = 'update:metrics';

const EditorBase = {
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
		metrics: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
	},
	emits:
	{
		[updateSource]: function(payload){ return isMatch(record.source, payload); },
		[updateMetrics]: function(payload){ return isMatch(record.metrics, payload); }
	},
	data()
	{
		return {
			current: cloneDeep(record.source),
			local: cloneDeep(record.metrics),
		}
	},
	watch:
	{
		source: {
			immediate: true,
			handler(value)
			{
				if(value === null) return;
				this.calcCurrent();
			}
		},
		metrics:
		{
			immediate: true,
			handler(value)
			{
				if(value === null) return;
				this.calcLocal();
			}
		}
	},
	computed:
	{
		isSource()
		{
			return this.source !== null;
		},
		isMetrics()
		{
			return this.metrics !== null;
		},
		isSourceNull()
		{
			return this.source === null;
		},
		isMetricsNull()
		{
			return this.metrics === null;
		},
	},
	created()
	{
		this.initCurrent();
		this.initLocal();
	},
	methods:
	{
		initCurrent()
		{
			// Overwrite this method if needed.
			// Decorate $current with additional properties if needed.
		},
		initLocal()
		{
			// Overwrite this method if needed.
			// Decorate $local with additional properties if needed.
		},
		calcCurrent()
		{
			this.current.filename = this.source.filename;
			this.current.url = this.source.url;
			this.current.size.width = this.source.size.width;
			this.current.size.height = this.source.size.height;

		},
		calcLocal()
		{
			this.local.x1.value = this.metrics.x1.value;
			this.local.x2.value = this.metrics.x2.value;
			this.local.y1.value = this.metrics.y1.value;
			this.local.y2.value = this.metrics.y2.value;
			this.local.rotate.value = this.metrics.rotate.value;
		},
		getSourceInstance()
		{
			return cloneDeep(record.source);
		},
		getMetricsInstance()
		{
			return cloneDeep(record.metrics);
		},
		copyMetricsValues(metrics)
		{
			const copy = this.getMetricsInstance();
					copy.x1.value = metrics.x1.value;
					copy.y1.value = metrics.y1.value;
					copy.x2.value = metrics.x2.value;
					copy.y2.value = metrics.y2.value;
					copy.rotate.value = metrics.rotate.value;
			return copy;
		}
	}
}

export default EditorBase;