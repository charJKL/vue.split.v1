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
	for(let line of [this.x1, this.x2, this.y1, this.y2])
	{
		const diff = {};
				diff.name = line.name;
		const base = line.subtype === 'vertical' ? x : y;
				diff.value = Math.abs(base - line.value);
		diffs.push(diff);
	}
	
	const threshold = 20;
	const near = minBy(diffs, (o) => o.value);
	this.hover = (near.value < threshold) ? near.name : null;
}

hover.onWheel = function(e)
{
	const value = this.getRotateValue + e.deltaY * sensitivity;
	this.updateMetrics('rotate', value);
}

export default hover;