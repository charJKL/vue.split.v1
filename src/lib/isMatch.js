function isMatch(blueprint, object)
{
	if(Object.keys(blueprint).length !== Object.keys(object).length) return false;
	
	for(let [key, value] of Object.entries(blueprint))
	{
		if(object[key] === undefined) return false;
		if(typeof object[key] !== typeof value) return false;
	}
	return true;
}

export {isMatch};
export default isMatch;