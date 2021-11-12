const EditorUtils = {
	methods:
	{
		calcScaleValue(display, margin, image)
		{
			const width = display.width - margin.left - margin.right;
			const height = display.height - margin.top - margin.bottom;
			const x = width / image.width;
			const y = height / image.height;
			return Math.min(x, y);
		},
		calcShiftValue(size, rotation)
		{
			const radians = rotation * Math.PI / 180;
			let x = size.width / 2;
			let y = size.height / 2;
			let nx = x * Math.cos(radians) + y * Math.sin(radians);
			let ny = x * Math.sin(radians) + y * Math.cos(radians);
			return { x: Math.abs(x - nx), y: Math.abs(y - ny) };
		}
	}
}

export default EditorUtils;