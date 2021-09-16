import Dragging from './EditorMetricsDragging';
import {minBy} from 'lodash';
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
	const {x, y} = this.resolvePosition(e.clientX, e.clientY);
	
	const diffs = [];
	diffs.push({name: 'x1', diff: Math.abs(x - this.getX1LineValue)});
	diffs.push({name: 'x2', diff: Math.abs(x - this.getX2LineValue)});
	diffs.push({name: 'y1', diff: Math.abs(y - this.getY1LineValue)});
	diffs.push({name: 'y2', diff: Math.abs(y - this.getY2LineValue)});
	
	const threshold = 20;
	const near = minBy(diffs, (o) => o.diff);
	this.hover = (near.diff < threshold) ? near.name : null;
}

hover.onWheel = function(e)
{
	const value = this.rotate + e.deltaY * sensitivity;
	
	this.rotate = value;
	this.updateMetrics('rotate', value);
}

export default hover;