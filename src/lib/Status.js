
const Status = { Dirty: 1, Stall: 2, Waiting: 3, Queued: 4, Loading: 5, Working: 6, Error: 7, Completed: 8 }

function mapStatusEnum(name)
{
	var properties = {};
	const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);
	for(const [key, value] of Object.entries(Status))
	{
		properties[`is${uppercaseName}${key}`] = function(){ return this?.[name]?.status === value };
	}
	properties[`print${uppercaseName}Status`] = function(){ return statusToString(this?.[name].status); }
	properties[`print${uppercaseName}Details`] = function(){ return this?.[name].details; }
	properties[`is${uppercaseName}Null`] = function(){ return this?.[name] == null; }
	properties[`is${uppercaseName}NotNull`] = function(){ return this?.[name] != null; }
	properties[`is${uppercaseName}NotCompleted`] = function(){ return this?.[name]?.status != Status.Completed };
	
	return properties;
}

function statusToString(status)
{
	for (let [key, value] of Object.entries(Status))
	{
		if(value === status) return key;
	}
	throw new Error(`Unknow status value '${status}'.`);
}

export default Status;
export {Status, mapStatusEnum};