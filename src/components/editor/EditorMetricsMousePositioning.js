import EditorMetricsMouseHover from './EditorMetricsMouseHover';

var initalMouse = {x: 0, y:0};
var initalPosition = {x: 0, y:0};
const sensitivity = 0.0001;

const EditorMetricsMousePositioning = 
{
	leftDown()
	{
		return;
	},
	rightDown(e)
	{
		if(this.isSource === false) return;
		const position = {x: e.clientX, y: e.clientY};

		initalPosition = {...this.position};
		initalMouse = position;
	},
	move(e)
	{
		if(this.isSource === false) return;
		const position = {x: e.clientX, y: e.clientY};
		const diff = {x: position.x - initalMouse.x, y: position.y - initalMouse.y};
		
		this.position.x = initalPosition.x + diff.x;
		this.position.y = initalPosition.y + diff.y;
	},
	leftUp()
	{
		return;
	},
	rightUp(e)
	{
		this.mouse = EditorMetricsMouseHover;
		this.onRightUp.call(this, e);
	},
	leave(e)
	{
		this.mouse = EditorMetricsMouseHover;
		this.onRightUp.call(this, e);
	},
	wheel(e)
	{
		this.scale.x = this.scale.x - e.deltaY * sensitivity;
		this.scale.y = this.scale.y - e.deltaY * sensitivity;
	}
}
export default EditorMetricsMousePositioning;