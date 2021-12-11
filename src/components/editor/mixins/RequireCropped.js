import {record} from '../../../store/records';
import Status, {mapStatusEnum} from '../../../lib/Status';
import {isMatch} from '../../../lib/isMatch';

const RequireCropped = {
	props:
	{
		cropped: { type: Object, validator(value){ return isMatch(record.cropped, value); } },
	},
	computed:
	{
		...mapStatusEnum('cropped'),
		getCroppedUrl()
		{
			return this.cropped?.blob ? URL.createObjectURL(this.cropped.blob) : null;
		},
		haveCroppedBlob()
		{
			return this.cropped.blob == true;
		},
		isStallCauseBySource()
		{
			return this.cropped.status == Status.Stall && this.cropped.details == 'source';
		},
		isStallCauseByMetrics()
		{
			return this.cropped.status == Status.Stall && this.cropped.details == 'metrics';
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