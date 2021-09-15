import Dragging from './EditorMetricsDragging';
const hover = {};
const sensitivity = 0.001;

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
	function isNear(v1, v2){ return Math.abs(v1 - v2) < threshold; }
	const {x, y} = this.resolvePosition(e.clientX, e.clientY);
	for(let metric of Object.values(this.metrics))
	{
		if(metric.type !== 'line') continue;
		if(metric.subtype === 'vertical' && isNear(x, metric.value) === true ){ this.hover = metric; return; }
		if(metric.subtype === 'horizontal' && isNear(y, metric.value) === true ){ this.hover = metric; return; }
	}
	this.hover = null;
}

hover.onWheel = function(e)
{
	this.rotate += e.deltaY * sensitivity;
}

export default hover;