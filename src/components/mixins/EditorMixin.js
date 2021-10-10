import {isMatch} from '../../lib/isMatch';
import {record} from '../../store/records';
import {cloneDeep} from 'lodash';

export const updateSource = 'update:source';
export const updateMetrics = 'update:metrics';

const EditorMixin = {
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
		metrics: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
	},
	emits: [updateSource, updateMetrics],
	data()
	{
		return {
			current: cloneDeep(record.source),
			local: cloneDeep(record.metrics),
		}
	},
	computed:
	{
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
			// If needed overwrite this method
		},
		initLocal()
		{
			// If needed overwrite this method
		}
	}
}

export default EditorMixin;