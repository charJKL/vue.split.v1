import Dragging from './EditorMetricsDragging';
import {minBy} from 'lodash';

const sensitivity = 0.001;
const threshold = 20;

const hover = 
{
	onLeftDown(e)
	{
		if(this.hover === null) return;
	
		this.mouse = Dragging;
		this.onMouseLeftDown.call(this, e);
	},
	onMove(e)
	{
		if(this.isCurrent === false) return;
		const position = this.resolveMousePosition(e.clientX, e.clientY);
		this.local.lines.forEach(metric => metric.diff = hover.calcDiff(metric.subtype, position, metric.value));
		const nearest = minBy(this.local.lines, (metric) => metric.diff);
		this.hover = (nearest.diff < threshold) ? nearest : null;
	},
	onLeave()
	{
		this.hover = null;
	},
	onWheel(e)
	{
		const value = this.local.rotate.value + e.deltaY * sensitivity;
		this.local.rotate.value = value;
		this.updateMetrics('rotate', value);
	},
	calcDiff(subtype, position, value)
	{
		return Math.abs((subtype === 'vertical' ? position.x : position.y) - value);
	}
}

export default hover;