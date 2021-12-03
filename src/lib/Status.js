
const Status = { Dirty: 1, Waiting: 2, Queued: 3, Loading: 4, Working: 5, Error: 6, Completed: 7 }

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