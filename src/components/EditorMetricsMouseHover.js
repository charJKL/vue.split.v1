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
		const position = calcMousePosition(this.$refs.editor.getBoundingClientRect(), e.clientX, e.clientY);
		const lines = [];
				lines.push({line: this.scaled.x1, diff: calcDiff(this.scaled.x1.subtype, position, this.scaled.x1.value)});
				lines.push({line: this.scaled.x2, diff: calcDiff(this.scaled.x2.subtype, position, this.scaled.x2.value)});
				lines.push({line: this.scaled.y1, diff: calcDiff(this.scaled.y1.subtype, position, this.scaled.y1.value)});
				lines.push({line: this.scaled.y2, diff: calcDiff(this.scaled.y2.subtype, position, this.scaled.y2.value)});

		const nearest = minBy(lines, (line) => line.diff);
		this.hover = (nearest.diff < threshold) ? nearest.line : null;
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
		this.updateMetrics();
	}
}

export default EditorMetricsMouseHover;