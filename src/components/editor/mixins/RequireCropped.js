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
		
		getCroppedUrl()
		{
			return this.cropped?.blob ? URL.createObjectURL(this.cropped.blob) : null;
		},
		printCroppedStatus()
		{
			return Status.toString(this.cropped.status);
		},
		isCroppedNotNull()
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
		isCroppedCompleted()
		{
			return this.cropped.status === Status.Completed;
		},
		isCroppedNotCompleted()
		{
			return this.cropped.status !== Status.Completed;
		}
	},
	watch:
	{
		getImageUrl(value, old)
		{
			URL.revokeObjectURL(old);
		}
	}
}

export default RequireCropped;