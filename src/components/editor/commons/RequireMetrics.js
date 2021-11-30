import {record} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

export const updateMetrics = 'update:metrics';

const RequireMetrics = {
	props:
	{
		metrics: { type: Object, validator(value){ return isMatch(record.metrics, value); } },
	},
	emits:
	{
		[updateMetrics]: function(payload){ return isMatch(record.metrics, payload); },
	},
	computed:
	{
		isMetric()
		{
			return this.metrics !== null;
		},
		isMetricNull()
		{
			return this.metrics === null;
		}
	}
}

export default RequireMetrics;