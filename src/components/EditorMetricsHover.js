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
		const {x, y} = this.resolvePosition(e.clientX, e.clientY);
		const metrics = [this.x1, this.x2, this.y1, this.y2];
		for(let metric of metrics)
		{
			const base = metric.subtype === 'vertical' ? x : y;
			metric.diff = Math.abs(base - metric.value);
		}
		const near = minBy(metrics, (metric) => metric.diff);
		this.hover = (near.diff < threshold) ? near : null;
	},
	onWheel(e)
	{
		const value = this.getRotateValue + e.deltaY * sensitivity;
		this.updateMetrics('rotate', value);
	}
}

export default hover;