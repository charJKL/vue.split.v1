import {mapStatusEnum} from '../../../lib/Status';
import {record} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

export const updateSource = 'update:source';

const RequireSource = {
	props:
	{
		source: { type: Object, validator(value){ return isMatch(record.source, value); } },
	},
	emits:
	{
		[updateSource]: function(payload){ return isMatch(record.source, payload); },
	},
	computed:
	{
		...mapStatusEnum('source'),
	}
}

export default RequireSource;