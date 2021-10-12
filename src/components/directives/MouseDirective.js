

const MouseDirective = 
{
	mounted(element, bind) 
	{
		console.log('type', element, bind, Object.entries(bind.value));
		
		for(let [type, listener] of Object.entries(bind.value))
		{
			console.log('type', listener);
			element.addEventListener(type, listener.bind(bind.instance));
		}
		
	}
}

export default MouseDirective;