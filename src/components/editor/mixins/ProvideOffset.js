const ProvideOffset = {
	data()
	{
		return {
			offset: {x: 0, y: 0}
		}
	},
	methods:
	{
		calcOffsetCenterValue(viewport, size)
		{
			const x = (viewport.width - size.width) / 2;
			const y = (viewport.height - size.height) / 2;
			return {x: x, y: y};
		}
	}
}

export default ProvideOffset;