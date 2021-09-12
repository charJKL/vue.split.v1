function isMatch(blueprint, object)
{
	for(let [key, value] of Object.entries(blueprint))
		{
			if(object[key] === undefined) return false;
			if(typeof object[key] !== typeof value) return false;
		}
	return true;
}

export {isMatch};
export default isMatch;