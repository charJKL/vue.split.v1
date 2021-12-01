
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
				width: this.source.width * this.scale.x,
				height: this.source.height * this.scale.y,
				x1: this.metrics.x1 * this.scale.x,
				x2: this.metrics.x2 * this.scale.x,
				y1: this.metrics.y1 * this.scale.y,
				y2: this.metrics.y2 * this.scale.y,
			}
		}
	},
	methods:
	{
		calcRatioScaleValue(viewport, size)
		{
			const x = viewport.width / size.width;
			const y = viewport.height / size.height;
			const scale = Math.min(x, y);
			return {x: scale, y: scale};
		}
	}
}

export default ProvideScale;