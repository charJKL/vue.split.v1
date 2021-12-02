import {record, Status} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

const RequireOcr = {
	props:
	{
		ocr: { type: Object, validator(value){ return isMatch(record.ocr, value); } },
	},
	computed:
	{
		isOcr()
		{
			return this.ocr != null;
		},
		isOcrNull()
		{
			return this.ocr == null;
		},
		isOcrNotDone()
		{
			return this.ocr.status !== Status.Done;
		}
	}
}

export default RequireOcr;