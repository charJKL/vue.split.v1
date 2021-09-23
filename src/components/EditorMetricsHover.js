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
		this.metrics.lines.forEach(metric => metric.diff = hover.calcDiff(metric.subtype, position, metric.position));
		const nearest = minBy(this.metrics.lines, (metric) => metric.diff);
		this.hover = (nearest.diff < threshold) ? nearest : null;
	},
	onWheel(e)
	{
		const value = this.metrics.rotate.value + e.deltaY * sensitivity;
		this.metrics.rotate.position = value;
		this.updateMetrics('rotate', value);
	},
	calcDiff(subtype, position, value)
	{
		return Math.abs((subtype === 'vertical' ? position.x : position.y) - value);
	}
}

export default hover;