import EditorMetricsMouseHover from './EditorMetricsMouseHover';
import {updateMetrics} from './mixins/RequireMetrics';

var initalMouse = {x: 0, y:0};
var initalValue = 0;

const EditorMetricsMouseDragging = 
{
	leftDown(e)
	{
		if(this.isSource === false) return;
		if(this.hover === null) return;
		
		initalMouse = {x: e.clientX, y: e.clientY};
		initalValue = this.scaled[this.hover];
	},
	rightDown()
	{
		return;
	},
	move(e)
	{
		if(this.isSource === false) return;
		if(this.hover === null) return;
		
		const position = {x: e.clientX, y: e.clientY};
		const diff = {x: position.x - initalMouse.x, y: position.y - initalMouse.y};
		const displacement = ['x1','x2'].includes(this.hover) ? diff.x : diff.y;
		const update = initalValue + displacement;
		
		if(this.hover === 'x1' && update > this.scaled.x2) this.hover = 'x2';
		if(this.hover === 'x2' && update < this.scaled.x1) this.hover = 'x1';
		if(this.hover === 'y1' && update > this.scaled.y2) this.hover = 'y2';
		if(this.hover === 'y2' && update < this.scaled.y1) this.hover = 'y1';
		this.scaled[this.hover] = update;
		
		// Scale up metrics:
		const metrics = {...this.metrics};
				metrics.x1 = this.scaled.x1 / this.scale.x;
				metrics.x2 = this.scaled.x2 / this.scale.x;
				metrics.y1 = this.scaled.y1 / this.scale.y;
				metrics.y2 = this.scaled.y2 / this.scale.y;
		this.$emit(updateMetrics, metrics);
	},
	leftUp(e)
	{
		this.mouse = EditorMetricsMouseHover;
		this.onLeftUp.call(this, e);
	},
	rightUp()
	{
		return;
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