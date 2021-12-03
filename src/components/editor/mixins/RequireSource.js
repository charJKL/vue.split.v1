import Status from '../../../lib/Status';
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
		isSource()
		{
			return this.source != null;
		},
		isSourceNull()
		{
			return this.source == null;
		},
		isSourceDirty()
		{
			return this.source.status == Status.Dirty;
		},
		isSourceWaiting()
		{
			return this.source.status == Status.Waiting;
		},
		isSourceLoading()
		{
			return this.source.status == Status.Loading;
		},
		isSourceDone()
		{
			return this.source.status == Status.Error || this.source.status == Status.Completed;
		}
	}
}

export default RequireSource;