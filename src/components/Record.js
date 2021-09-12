export default
{
	wasEdited: false,
	isSelected: false,
	errors: [],
	source:
	{
		filename: '',
		url: '',
		size: {width: 0, height: 0},
	},
	metrics:
	{
		x1: { type: 'line', subtype: 'vertical', hover: false, active: false, value: 50 },
		x2: { type: 'line', subtype: 'vertical', hover: false, active: false, value: 250 },
		y1: { type: 'line', subtype: 'horizontal', hover: false, active: false, value: 50 },
		y2: { type: 'line', subtype: 'horizontal', hover: false, active: false, value: 250 },
		rotate: { type: 'value', hover: false, active: false, value: 0 },
		layout: { type: 'manual', hover: false, active: false, value: false },
	}
}