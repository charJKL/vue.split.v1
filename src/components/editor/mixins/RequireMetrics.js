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
		isMetricsNull()
		{
			return this.metrics == null;
		},
		isMetricsNotNull()
		{
			return this.metrics != null;
		},
		wasMetricsEdited()
		{
			return this.metrics.wasEdited;
		}
	}
}

export default RequireMetrics;