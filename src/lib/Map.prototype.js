import {clone} from './clone';

const genKeyCounter = Symbol('epub.split.counter');

Map.prototype[genKeyCounter] = 0;

Map.prototype.genKey = function()
{
	this[genKeyCounter]++;
	return this[genKeyCounter];
}

Map.prototype.insert = function(object)
{
	this.set(this.genKey(), clone(object));
};