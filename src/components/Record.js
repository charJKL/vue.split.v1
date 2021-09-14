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
		x1: { name: 'x1', type: 'line', subtype: 'vertical', value: 50 },
		x2: { name: 'x2', type: 'line', subtype: 'vertical', value: 250 },
		y1: { name: 'y1', type: 'line', subtype: 'horizontal', value: 50 },
		y2: { name: 'y2', type: 'line', subtype: 'horizontal', value: 250 },
		rotate: { name: 'rotate', type: 'float', value: 0 },
	}
}