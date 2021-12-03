
const Status = { Dirty: 1, Waiting: 2, Queued: 3, Working: 4, Done: 5 }

Status.toString = function(status)
{
	for (let [key, value] of Object.entries(Status))
	{
		if(value === status) return key;
	}
	throw new Error(`Unknow status value '${status}'.`);
}

export default Status;
export {Status};