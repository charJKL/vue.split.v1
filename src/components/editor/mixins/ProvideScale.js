import Button from '../../../lib/Button';

const ScaleType = {out: 'out', in: 'in'};
const ProvideScale = {
	data()
	{
		return {
			scale: {x: 1.0, y: 1.0},
			provideScale: {
				isScaling: false,
				wasScaled: null,
				sensitivity: 0.0001,
			}
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
			
		},
		printScaleValue()
		{
			return `${this.scale.x.toFixed(2) } / ${this.scale.y.toFixed(2)}`;
		}
	},
	watch:
	{
		'provideScale.wasScaled': function(wasScaled)
		{
			switch(wasScaled)
			{
				case null:
					this.$el.classList.remove('cursor-scale-in');
					this.$el.classList.remove('cursor-scale-out');
					return;
					
				case ScaleType.in:
					setTimeout(()=>{this.provideScale.wasScaled = null;}, 200);
					this.$el.classList.remove('cursor-scale-out');
					this.$el.classList.add('cursor-scale-in');
					return;
				
				case ScaleType.out:
					setTimeout(()=>{this.provideScale.wasScaled = null;}, 200);
					this.$el.classList.remove('cursor-scale-in');
					this.$el.classList.add('cursor-scale-out');
					return;
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
	},
	mounted()
	{
		this.$el.addEventListener('mousedown', mousedown.bind(this));
		this.$el.addEventListener('mouseup', mouseup.bind(this));
		this.$el.addEventListener('mouseleave', mouseleave.bind(this));
		this.$el.addEventListener('wheel', wheel.bind(this));
		
		function mousedown(e)
		{
			if(e.button !== Button.right) return;
			this.provideScale.isScaling = true;
		}
		function mouseup()
		{
			this.provideScale.isScaling = false;
		}
		function mouseleave()
		{
			this.provideScale.isScaling = false;
		}
		function wheel(e)
		{
			if(this.provideScale.isScaling === false) return;
			e.preventDefault();
			this.scale.x = this.scale.x - e.deltaY * this.provideScale.sensitivity;
			this.scale.y = this.scale.y - e.deltaY * this.provideScale.sensitivity;
			this.provideScale.wasScaled = (e.deltaY > 0 ) ? ScaleType.out : ScaleType.in;
		}
	}
}

export default ProvideScale;