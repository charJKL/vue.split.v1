function List()
{
	this.head = null;
	this.tail = null;
	this.length = null;
}

List.prototype[Symbol.iterator] = function* () 
{
	for(var current = this.head ; current !== null ; current = current.next) yield current.value;
};

List.prototype.push = function(object) 
{
	if(this.tail === null)
	{
		this.head = {value: object, next: null};
		this.tail = this.head;
		this.length++;
		return;
	}
	this.tail.next = {value: object, next: null};
	this.tail = this.tail.next;
	this.length++;
};

List.prototype.pop = function () 
{
	const temp = this.head;
	this.head = temp.next;
	this.length--;
	return temp.value;
};

List.prototype.enqueue = function(object)
{
	if(this.head === null)
	{
		this.push(object);
		return;
	}
	const temp = this.head;
	this.head = {value: object, next: temp};
	this.length++;
}

List.prototype.peek = function()
{
	return this.head.value;
}

List.prototype.delete = function(object)
{
	var previous = null;
	var current = this.head;
	while(current != null)
	{
		if(current.value === object)
		{
			if(previous != null) previous.next = current.next;
			if(previous === null) this.head = current.next;
			if(current.next === null) this.tail = previous;
			this.length--;
			return;
		}
		previous = current;
		current = current.next;
	}
}

List.prototype.toArray = function()
{
	const array = [];
	for(const element of this) array.push(element);
	return array;
}

export default List;