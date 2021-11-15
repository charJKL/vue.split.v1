import Hover from './EditorMetricsMouseHover';


//var originalFocus = null; // eslint-disable-line no-unused-vars
//var originalValues = null; // eslint-disable-line no-unused-vars

var originalPosition = {x: 0, y:0};
var originalValue = 0;

const EditorMetricsMouseDragging = 
{
	leftDown (e)
	{
		if(this.isSource === false) return;
		if(this.hover === null) return;
		
		this.active = this.hover;
		originalPosition = {x: e.clientX, y: e.clientY};
		originalValue = this.active.value;
	},
	move(e)
	{
		if(this.isSource === false) return;
		if(this.active === null) return;
		const position = {x: e.clientX, y: e.clientY};
		const diff = {x: position.x - originalPosition.x, y: position.y - originalPosition.y};
		const displacement = this.active.subtype === 'vertical' ? diff.x : diff.y;
		const update = originalValue + displacement;
		
		if(this.active.name === 'x1' && update > this.scaled.x2.value) this.hover = this.active = this.scaled.x2;
		if(this.active.name === 'x2' && update < this.scaled.x1.value) this.hover = this.active = this.scaled.x1;
		if(this.active.name === 'y1' && update > this.scaled.y2.value) this.hover = this.active = this.scaled.y2;
		if(this.active.name === 'y2' && update < this.scaled.y1.value) this.hover = this.active = this.scaled.y1;
		
		this.active.value = update;
		this.updateMetrics();
	},
	leftUp(e)
	{
		this.active = null;
		this.mouse = Hover;
		this.onLeftUp.call(this, e);
	},
	leave()
	{
		return;
	},
	wheel()
	{
		return;
	}
}
export default EditorMetricsMouseDragging;