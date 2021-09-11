export default
{
	wasEdited: false,
	isSelected: false,
	error: false,
	source:
	{
		filename: '',
		url: '',
		size: {width: 0, height: 0},
	},
	metrics:
	{
		x1: { type: 'line', subtype: 'vertical', value: 0 },
		x2: { type: 'line', subtype: 'vertical', value: 0 },
		y1: { type: 'line', subtype: 'horizontal', value: 0 },
		y2: { type: 'line', subtype: 'horizontal', value: 0 },
		rotate: { type: 'value', value: 0},
		layout: { type: 'manual', value: false },
	}
}