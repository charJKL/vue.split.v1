
const MouseDirective = 
{
	dom: new Map(),
	created(element, bind)
	{
		bind.dir.dom.set(element, []);
	},
	mounted(element, bind) 
	{
		for(let [type, listener] of Object.entries(bind.value))
		{
			const bindedListener = listener.bind(bind.instance);
			element.addEventListener(type, bindedListener);
			bind.dir.dom.get(element).push([type, bindedListener]);
		}
	},
	beforeUpdate(element, bind)
	{
		if(bind.oldValue === bind.value) return;
		if(Object.keys(bind.oldValue) !== Object.keys(bind.value)) throw new Error("Bind do not match");
		console.log(bind.value);
		const bindedListeners = [];
		for(let [type, listener] of bind.dir.dom.get(element)) element.removeEventListener(type, listener);
		for(let [type, listener] of Object.entries(bind.value)) bindedListeners.push([type, listener.bind(element)]);
		for(let [type, listener] of bindedListeners) element.addEventListener(type, listener);
		bind.dir.dom.set(element, bindedListeners);
	},
	beforeUnmount(element, bind)
	{
		const listeners = bind.dir.dom.get(element);
		for(let [type, listener] of listeners)
		{
			element.removeEventListener(type, listener);
		}
	},
	unmounted(element, bind)
	{
		bind.dir.dom.remove(element);
	}
}

export default MouseDirective;