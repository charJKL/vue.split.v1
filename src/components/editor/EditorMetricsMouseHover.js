import EditorMetricsMouseOffseting from './EditorMetricsMouseOffseting';
import {updateMetrics} from './mixins/RequireMetrics';
const sensitivity = 0.001;

const EditorMetricsMouseHover = 
{
	leftDown()
	{
		return;
	},
	rightDown(e)
	{
		if(this.isSource === false) return;
		this.mouse = EditorMetricsMouseOffseting;
		this.onRightDown.call(this, e);
	},
	move()
	{
		return;
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
		return;
	},
	wheel(e)
	{
		const metrics = {...this.metrics};
				metrics.rotate = this.metrics.rotate + e.deltaY * sensitivity;
		this.$emit(updateMetrics, metrics);
	}
}

export default EditorMetricsMouseHover;