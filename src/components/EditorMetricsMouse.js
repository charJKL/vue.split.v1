import {isMatch} from '../lib/isMatch';
import EditorMetricsMouseHover from './EditorMetricsMouseHover';

const EditorMetricsMouse = 
{
	data()
	{
		return {
			mouse: EditorMetricsMouseHover
		}
	},
	computed:
	{
		onLeftDown()
		{
			return this.mouse.leftDown.bind(this);
		},
		onLeftUp()
		{
			return this.mouse.leftUp.bind(this);
		},
		onMove()
		{
			return this.mouse.move.bind(this);
		},
		onLeave()
		{
			return this.mouse.leave.bind(this);
		},
		onWheel()
		{
			return this.mouse.wheel.bind(this);
		}
	},
	watch:
	{
		mouse(old, value)
		{
			if(isMatch(old, value) === false) throw new Error("Mouse events object doesn't match");
		}
	}
}

export default EditorMetricsMouse;