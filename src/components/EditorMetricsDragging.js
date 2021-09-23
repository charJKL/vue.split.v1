import Hover from './EditorMetricsHover';

var begin = {x: 0, y: 0};
var saved = 0;

const dragging = 
{
	onLeftDown (e)
	{
		if(this.isCurrent === false) return;
		if(this.hover === null) return;
		
		this.active = this.hover;
		begin = {x: e.clientX, y: e.clientY};
		saved = this.active.position;
	},
	onMove(e)
	{
		if(this.isCurrent === false) return;
		if(this.active === null) return;
		const position = {x: e.clientX, y: e.clientY};
		const diff = {x: position.x - begin.x, y: position.y - begin.y};
		const displacement = this.active.subtype === 'vertical' ? diff.x : diff.y;
		const update = saved + displacement;
		
		if(this.active.name === 'x1' && update > this.metrics.x2.position) this.hover = this.active = this.metrics.x2;
		if(this.active.name === 'x2' && update < this.metrics.x1.position) this.hover = this.active = this.metrics.x1;
		if(this.active.name === 'y1' && update > this.metrics.y2.position) this.hover = this.active = this.metrics.y2;
		if(this.active.name === 'y2' && update < this.metrics.y1.position) this.hover = this.active = this.metrics.y1;
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