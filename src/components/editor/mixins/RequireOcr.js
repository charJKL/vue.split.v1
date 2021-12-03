import Status from '../../../lib/Status';
import {record} from '../../../store/records';
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
		isOcrNotCompleted()
		{
			return this.ocr.status !== Status.Completed;
		}
	}
}

export default RequireOcr;