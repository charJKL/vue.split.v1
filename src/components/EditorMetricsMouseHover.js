import EditorMetricsMouseDragging from './EditorMetricsMouseDragging';
import {minBy} from 'lodash';

const sensitivity = 0.001;
const threshold = 20;

function calcDiff(subtype, position, value)
{
	return Math.abs((subtype === 'vertical' ? position.x : position.y) - value);
}

function calcMousePosition(boundingRect, x, y)
{
	return { x: x - boundingRect.left, y: y - boundingRect.y };
}

const EditorMetricsMouseHover = 
{
	leftDown(e)
	{
		if(this.hover === null) return;
	
		this.mouse = EditorMetricsMouseDragging;
		this.onLeftDown.call(this, e);
	},
	move(e)
	{
		if(this.isSource === false) return;
		const position = calcMousePosition(this.$refs.canvas.getBoundingClientRect(), e.clientX, e.clientY);
		this.scaled.lines.forEach(metric => metric.diff = calcDiff(metric.subtype, position, metric.value));
		const nearest = minBy(this.scaled.lines, (metric) => metric.diff);
		this.hover = (nearest.diff < threshold) ? nearest : null;
	},
	leftUp()
	{
		return; // do nothing
	},
	leave()
	{
		this.hover = null;
	},
	wheel(e)
	{
		this.scaled.rotate.value = this.scaled.rotate.value + e.deltaY * sensitivity;
		this.updateRotation();
		this.updateMetrics();
	}
}

export default EditorMetricsMouseHover;