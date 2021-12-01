const ProvidePosition = {
	data()
	{
		return {
			position: {x: 0, y: 0}
		}
	},
	methods:
	{
		calcCenterPositionValue(viewport, size)
		{
			const x = (viewport.width - size.width) / 2;
			const y = (viewport.height - size.height) / 2;
			return {x: x, y: y};
		}
	}
}

export default ProvidePosition;