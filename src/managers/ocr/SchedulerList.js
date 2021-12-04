function SchedulerList()
{
	this.head = null;
	this.tail = null;
	this.length = null;
}

SchedulerList.prototype[Symbol.iterator] = function* () 
{
	for(var current = this.head ; current !== null ; current = current.next) yield current.value;
};

SchedulerList.prototype.enqueue = function(object)
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

SchedulerList.prototype.push = function(object) 
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

SchedulerList.prototype.pop = function () 
{
	const temp = this.head;
	this.head = temp.next;
	this.length--;
	return temp.value;
};

SchedulerList.prototype.peek = function()
{
	return this.head.value;
}

SchedulerList.prototype.delete = function(object)
{
	if(this.head.value === object)
	{
		this.head = this.head.next;
		this.length--;
		return;
	}
	
	var previous = null;
	for(const current of this)
	{
		if(current.value === object)
		{
			previous.next = current.next;
			if(current.next === null) this.tail = previous;
			this.length--;
			return;
		}
		previous = current;
	}
}

SchedulerList.prototype.toArray = function()
{
	const array = [];
	for(const element of this) array.push(element);
	return array;
}

export default SchedulerList;