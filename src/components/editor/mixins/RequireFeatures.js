import {record} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

export const updateFeatures = 'update:features';

const RequireFeatures = {
	props:
	{
		features: { type: Object, validator(value){ return isMatch(record.features, value); } },
	},
	emits:
	{
		[updateFeatures]: function(payload){ return isMatch(record.features, payload); },
	},
}

export default RequireFeatures;