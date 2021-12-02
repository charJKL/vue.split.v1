import {Loading, record} from '../../../store/records';
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
		isSource()
		{
			return this.source != null;
		},
		isSourceNull()
		{
			return this.source == null;
		},
		isLoadingIdle()
		{
			return this.source.loading == Loading.Idle;
		},
		isLoadingWaiting()
		{
			return this.source.loading == Loading.Waiting;
		},
		isLoadingDone()
		{
			return this.source.loading == Loading.Done;
		}
	}
}

export default RequireSource;