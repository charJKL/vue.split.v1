import {record} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';
import {Status} from '../../../lib/Status';

const RequireCropped = {
	props:
	{
		cropped: { type: Object, validator(value){ return isMatch(record.cropped, value); } },
	},
	computed:
	{
		printCroppedStatus()
		{
			return Status.toString(this.cropped.status);
		},
		isCropped()
		{
			return this.cropped != null;
		},
		isCroppedNull()
		{
			return this.cropped == null;
		},
		isCroppedDirty()
		{
			return this.cropped.status === Status.Dirty;
		},
		isCroppedWaiting()
		{
			return this.cropped.status === Status.Waiting;
		},
		isCroppedQueued()
		{
			return this.cropped.status === Status.Queued;
		},
		isCroppedWorking()
		{
			return this.cropped.status === Status.Working;
		},
		isCroppedDone()
		{
			return this.cropped.status === Status.Done;
		},
		isCroppedNotDone()
		{
			return this.cropped.status !== Status.Done;
		}
	}
}

export default RequireCropped;