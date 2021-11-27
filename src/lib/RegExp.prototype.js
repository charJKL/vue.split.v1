RegExp.prototype.fullMatch = function(string)
{
	const result = string.match(this);
	if(result === null) return false;
	return string.length === result[0].length;
}
