import {setFocus} from '../store/ui'

var originalValues = null; // eslint-disable-line no-unused-vars
const casting = 
{
	parseType(type, value)
	{
		return type === 'line' ? parseInt(value) : parseFloat(value);
	}
}
const EditorInputMouseFocus = 
{
	focus(e, metric) // eslint-disable-line no-unused-vars
	{
		this.focus = metric;
		originalValues = this.copyMetricsValues(this.local);
		this.$store.dispatch(setFocus, metric.name);
	},
	input(e, metric) // eslint-disable-line no-unused-vars
	{
		if(this.focus === null) return;
		const value = casting.parseType(metric.type, e.target.value);
		
		if(this.focus.name === 'x1' && value >= originalValues.x2.value) this.local.x2.value = value + 1;
		if(this.focus.name === 'x1' && value < originalValues.x2.value) this.local.x2.value = originalValues.x2.value;
		if(this.focus.name === 'x2' && value <= originalValues.x1.value ) this.local.x1.value = value - 1;
		if(this.focus.name === 'x2' && value > originalValues.x1.value) this.local.x1.value = originalValues.x1.value;
		if(this.focus.name === 'y1' && value >= originalValues.y2.value) this.local.y2.value = value + 1;
		if(this.focus.name === 'y1' && value < originalValues.y2.value) this.local.y2.value = originalValues.y2.value;
		if(this.focus.name === 'y2' && value <= originalValues.y1.value ) this.local.y1.value = value - 1;
		if(this.focus.name === 'y2' && value > originalValues.y1.value) this.local.y1.value = originalValues.y1.value;
		
		this.focus.value = value;
	},
	blur(e, metric) // eslint-disable-line no-unused-vars
	{
		this.focus = null;
		originalValues = null;
		this.$store.dispatch(setFocus, '');
	}
}

export default EditorInputMouseFocus;