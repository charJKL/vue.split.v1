
const ProvideScale = {
	data()
	{
		return {
			scale: {x: 1.0, y: 1.0}
		}
	},
	computed:
	{
		scaled()
		{
			return {
				width: this.source.width * this.scale,
				height: this.source.height * this.scale,
				x1: this.metrics.x1 * this.scale,
				x2: this.metrics.x2 * this.scale,
				y1: this.metrics.y1 * this.scale,
				y2: this.metrics.y2 * this.scale,
			}
		}
	},
	methods:
	{
		calcRatioScaleValue(viewport, size)
		{
			const width = viewport.width;
			const height = viewport.height;
			const x = width / size.width;
			const y = height / size.height;
			const scale = Math.min(x, y);
			return {x: scale, y: scale};
		}
	}
}

export default ProvideScale;