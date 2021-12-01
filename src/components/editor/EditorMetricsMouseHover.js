import EditorMetricsMousePositioning from './EditorMetricsMousePositioning';
import EditorMetricsMouseDragging from './EditorMetricsMouseDragging';
import {updateMetrics} from './mixins/RequireMetrics';
import {minBy} from 'lodash';

const sensitivity = 0.001;
const threshold = 20;

function calcMousePosition(boundingRect, position, x, y)
{
	return { x: x - boundingRect.left - position.x, y: y - boundingRect.y - position.y };
}

const EditorMetricsMouseHover = 
{
	leftDown(e)
	{
		if(this.hover === null) return;
		this.mouse = EditorMetricsMouseDragging;
		this.onLeftDown.call(this, e);
	},
	rightDown(e)
	{
		if(this.isSource === false) return;
		this.mouse = EditorMetricsMousePositioning;
		this.onRightDown.call(this, e);
	},
	move(e)
	{
		if(this.isSource === false) return;
		const position = calcMousePosition(this.$refs.editor.getBoundingClientRect(), this.position, e.clientX, e.clientY);
		const lines = [];
				lines.push({line: 'x1', diff: Math.abs(this.scaled.x1 - position.x) });
				lines.push({line: 'x2', diff: Math.abs(this.scaled.x2 - position.x) });
				lines.push({line: 'y1', diff: Math.abs(this.scaled.y1 - position.y) });
				lines.push({line: 'y2', diff: Math.abs(this.scaled.y2 - position.y) });
		
		const nearest = minBy(lines, (line) => line.diff);
		this.hover = (nearest.diff < threshold) ? nearest.line : null;
	},
	leftUp()
	{
		return;
	},
	rightUp()
	{
		return;
	},
	leave()
	{
		this.hover = null;
	},
	wheel(e)
	{
		if(this.isSource === false) return;
		const metrics = {...this.metrics};
				metrics.rotate = this.metrics.rotate + e.deltaY * sensitivity;
		this.$emit(updateMetrics, metrics);
	}
}

export default EditorMetricsMouseHover;