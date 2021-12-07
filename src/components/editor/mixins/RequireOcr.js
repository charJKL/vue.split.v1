import {record} from '../../../store/records';
import {isMatch} from '../../../lib/isMatch';

const RequireOcr = {
	props:
	{
		ocr: { type: Object, validator(value){ return isMatch(record.ocr, value); } },
	},
	computed:
	{
		isOcrNotNull()
		{
			return this.ocr != null;
		}
	}
}

export default RequireOcr;