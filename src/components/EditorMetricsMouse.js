import EditorMetricsMouseHover from './EditorMetricsMouseHover';
import {record} from '../store/records';
import {isMatch} from '../lib/isMatch';
import {cloneDeep} from 'lodash';


const EditorMetricsMouse = 
{
	data()
	{
		return {
			mouse: EditorMetricsMouseHover,
			ui: cloneDeep(record.metrics),
			hover: null,
			active: null,
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
	created()
	{
		this.ui.x1.hover = false;
		this.ui.x2.hover = false;
		this.ui.y1.hover = false;
		this.ui.y2.hover = false;
	},
	watch:
	{
		mouse(value, old)
		{
			if(isMatch(old, value) === false) throw new Error("Mouse events object doesn't match");
		},
		hover(value, old)
		{
			if(old !== null) this.ui[old.name].hover = false;
			if(value !== null) this.ui[value.name].hover = true;
		}
	}
}

export default EditorMetricsMouse;