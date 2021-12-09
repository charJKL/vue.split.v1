import {record} from '../../../store/records';
import {mapStatusEnum} from '../../../lib/Status';
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