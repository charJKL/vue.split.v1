import Hover from './EditorMetricsHover';

const dragging = {};
var location = {x: 0, y: 0};
var value = 0;


dragging.onLeftDown = function(e)
{
	if(this.isCurrent === null) return;
	if(this.hover === null) return;
	
	this.active = this.hover;
	location = {x: e.clientX, y: e.clientY};
	value = this[this.active].value;
}

dragging.onMove = function(e)
{
	if(this.isCurrent === false) return;
	if(this.active === null) return;
	const position = {x: e.clientX, y: e.clientY};
	const diff = {x: position.x - location.x, y: position.y - location.y};
	console.log(this.active);
	const displacement = this.active.subtype === 'vertical' ? diff.x : diff.y;
	const update = value + displacement;
	
	this.updateMetrics(this.active, update);
}

dragging.onLeftUp = function(e)
{
	this.active = null;
	this.mouse = Hover;
	this.onMouseLeftUp.call(this, e);
}

export default dragging;