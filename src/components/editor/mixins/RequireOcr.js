import {record} from '../../../store/records';
import {mapStatusEnum} from '../../../lib/Status';
import {isMatch} from '../../../lib/isMatch';

const RequireOcr = {
	props:
	{
		ocr: { type: Object, validator(value){ return isMatch(record.ocr, value); } },
	},
	computed:
	{
		...mapStatusEnum('ocr'),
		haveOcrData()
		{
			return this.wasParsed;
		}
	}
}

export default RequireOcr;