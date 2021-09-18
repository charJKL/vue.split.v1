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