
//const threshold = { metric: null, value: 0 };

const focus = 
{
	focus(e, metric) // eslint-disable-line no-unused-vars
	{
		console.log('focus form events');
		this.focus = metric;
		
		//if(metric.name === 'x1') threshold = { metric: this.local.x2, value: this.local.x2.value };
	},
	input(e, metric) // eslint-disable-line no-unused-vars
	{
		console.log('onInput', metric);
		
		const value = casting.parseType(metric.type, e.target.value);
		
		//if(metric.name === 'x1' && this.local.x1.value > this.local.x2.value) this.focus = this.local.x2;
		//if(metric.name === 'x2' && this.local.x1.value < this.local.x2.value) this.focus = this.local.x1;
		//if/(metric.name === 'y1' && this.local.y1.value > this.local.y2.value) this.focus = this.local.y2;
		//if(metric.name === 'y2' && this.local.y1.value < this.local.y2.value) this.focus = this.local.y1;
		
		this.focus.value = value;
	},
	blur(e, metric) // eslint-disable-line no-unused-vars
	{
		this.focus = null;
	},
}

const casting = 
{
	parseType(type, value)
	{
		return type === 'line' ? parseInt(value) : parseFloat(value);
	},

}

export default focus;