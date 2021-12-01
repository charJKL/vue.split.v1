import EditorMetricsMouseHover from './EditorMetricsMouseHover';
import {isMatch} from '../../lib/isMatch';

const EditorMetricsMouse = 
{
	data()
	{
		return {
			mouse: EditorMetricsMouseHover,
			hover: null,
		}
	},
	computed:
	{
		onLeftDown()
		{
			return this.mouse.leftDown.bind(this);
		},
		onRightDown()
		{
			return this.mouse.rightDown.bind(this);
		},
		onLeftUp()
		{
			return this.mouse.leftUp.bind(this);
		},
		onRightUp()
		{
			return this.mouse.rightUp.bind(this);
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
		},
		onContextmenu()
		{
			return (e) => { e.preventDefault(); }
		}
	},
	watch:
	{
		mouse(value, old)
		{
			if(isMatch(old, value) === false) throw new Error("Mouse events object doesn't match");
		},
	}
}

export default EditorMetricsMouse;