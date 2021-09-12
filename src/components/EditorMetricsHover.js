import Dragging from './EditorMetricsDragging';
const hover = {};

hover.onLeftDown = function(e)
{
	if(this.hover === null) return;
	
	this.mouse = Dragging;
	this.onMouseLeftDown.call(this, e);
}

hover.onMove = function(e)
{
	if(this.isCurrent === false) return;
	const threshold = 20;
	const near = (v1, v2) => Math.abs(v1 - v2) < threshold;
	const {x, y} = this.resolvePosition(e.clientX, e.clientY);
	for(let metric of Object.values(this.metrics))
	{
		if(metric.type !== 'line') continue;
		if(metric.subtype === 'vertical' && near(x, metric.value) === true ){ this.hover = metric; return; }
		if(metric.subtype === 'horizontal' && near(y, metric.value) === true ){ this.hover = metric; return; }
	}
	this.hover = null;
}

export default hover;