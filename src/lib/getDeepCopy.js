import {cloneDeep} from 'lodash';

function getDeepCopy(object)
{
	return cloneDeep(object)
}

export {getDeepCopy};
export default getDeepCopy;