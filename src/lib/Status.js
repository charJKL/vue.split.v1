
const Status = { Dirty: 1, Waiting: 2, Queued: 3, Loading: 4, Working: 5, Error: 6, Completed: 7 }

function mapStatusEnum(name)
{
	var properties = {};
	const uppercaseName = name.charAt(0).toUpperCase() + name.slice(1);
	for(const [key, value] of Object.entries(Status))
	{
		properties[`is${uppercaseName}${key}`] = function(){ return this?.[name].status === value };
	}
	properties['printStatus'] = function(){ return statusToString(this?.[name].status); }
	properties['printDetauils'] = function(){ return this?.[name].details; }
	properties[`is${uppercaseName}NotNull`] = function(){ return this?.[name] != null; }
	properties[`is${uppercaseName}NotCompleted`] = function(){ return this?.[name].status != Status.Completed };
	
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