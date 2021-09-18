import Hover from './EditorMetricsHover';

var startPosition = {x: 0, y: 0};
var startValue = 0;

const dragging = 
{
	onLeftDown (e)
	{
		if(this.isCurrent === null) return;
		if(this.hover === null) return;
		
		this.active = this.hover;
		startPosition = {x: e.clientX, y: e.clientY};
		startValue = this.active.value;
	},
	onMove(e)
	{
		if(this.isCurrent === false) return;
		if(this.active === null) return;
		const position = {x: e.clientX, y: e.clientY};
		const diff = {x: position.x - startPosition.x, y: position.y - startPosition.y};
		const displacement = this.active.subtype === 'vertical' ? diff.x : diff.y;
		const update = startValue + displacement;
		
		if(this.active.name === 'x1' && update > this.x2.value) this.hover = this.active = this.x2;
		if(this.active.name === 'x2' && update < this.x1.value) this.hover = this.active = this.x1;
		if(this.active.name === 'y1' && update > this.y2.value) this.hover = this.active = this.y2;
		if(this.active.name === 'y2' && update < this.y1.value) this.hover = this.active = this.y1;
		this.updateMetrics(this.active.name, update);
	},
	onLeftUp(e)
	{
		this.active = null;
		this.mouse = Hover;
		this.onMouseLeftUp.call(this, e);
	}
}
export default dragging;