import {record, Status} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

const RequireCropped = {
	props:
	{
		cropped: { type: Object, validator(value){ return isMatch(record.cropped, value); } },
	},
	computed:
	{
		isCropped()
		{
			return this.cropped !== null;
		},
		isCroppedNull()
		{
			return this.cropped === null;
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
		}
	}
}

export default RequireCropped;