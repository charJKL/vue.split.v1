import {updateMetrics} from './mixins/RequireMetrics';
import {minBy} from 'lodash';

const sensitivity = 0.001;

function calcMousePosition(boundingRect, position, x, y)
{
	return { x: x - boundingRect.left - position.x, y: y - boundingRect.y - position.y };
}

const EditorMetricsMouseHover = 
{
	data()
	{
		return {
			hover: null,
			mouseHover: {
				threshold: 20
			}
		}
	},
	mounted()
	{
		// There is no need to remove those listeners, will get lost with element.
		this.$el.addEventListener('mousemove', mousemove.bind(this));
		this.$el.addEventListener('wheel', wheel.bind(this));
		
		function mousemove(e)
		{
			if(this.isSourceNull === true) return;
			e.preventDefault();
			
			const position = calcMousePosition(this.$refs.editor.getBoundingClientRect(), this.position, e.clientX, e.clientY);
			const lines = [];
				lines.push({line: 'x1', diff: Math.abs(this.scaled.x1 - position.x) });
				lines.push({line: 'x2', diff: Math.abs(this.scaled.x2 - position.x) });
				lines.push({line: 'y1', diff: Math.abs(this.scaled.y1 - position.y) });
				lines.push({line: 'y2', diff: Math.abs(this.scaled.y2 - position.y) });
		
			const nearest = minBy(lines, (line) => line.diff);
			this.hover = (nearest.diff < this.mouseHover.threshold) ? nearest.line : null;
		}
		function wheel(e)
		{
			if(this.isSourceNull === true) return;
			if(this.provideScale.isScaling === true) return;
			const metrics = {...this.metrics};
				metrics.rotate = this.metrics.rotate + e.deltaY * sensitivity;
			this.$emit(updateMetrics, metrics);
		}
	}
}

export default EditorMetricsMouseHover;