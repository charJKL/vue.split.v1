import {updateMetrics} from './mixins/RequireMetrics';

const Button = {left: 0, right: 2};

const EditorMetricsMouseDragging = 
{
	data()
	{
		return {
			dragging: null,
			mouseDragging: {
				isDragging: false,
				initalMouse: {x: 0, y: 0},
				initalValue: 0,
			}
		}
	},
	mounted()
	{
		// There is no need to remove those listeners, will get lost with element.
		this.$el.addEventListener('mousedown', mousedown.bind(this));
		this.$el.addEventListener('mousemove', mousemove.bind(this));
		this.$el.addEventListener('mouseup', mouseup.bind(this));
		this.$el.addEventListener('mouseleave', mouseleave.bind(this));
		
		
		function mousedown(e)
		{
			if(this.hover === null) return;
			if(e.button !== Button.left) return;
			e.preventDefault();
			
			this.dragging = this.hover;
			this.mouseDragging.isDragging = true;
			this.mouseDragging.initalMouse = {x: e.clientX, y: e.clientY};
			this.mouseDragging.initalValue = this.scaled[this.dragging];
		}
		function mousemove(e)
		{
			if(this.mouseDragging.isDragging === false) return;
			e.preventDefault();
			
			const position = {x: e.clientX, y: e.clientY};
			const diff = {x: position.x - this.mouseDragging.initalMouse.x, y: position.y - this.mouseDragging.initalMouse.y};
			const displacement = ['x1','x2'].includes(this.dragging) ? diff.x : diff.y;
			const update = this.mouseDragging.initalValue + displacement;
			
			if(this.dragging === 'x1' && update > this.scaled.x2) this.hover = this.dragging = 'x2';
			if(this.dragging === 'x2' && update < this.scaled.x1) this.hover = this.dragging = 'x1';
			if(this.dragging === 'y1' && update > this.scaled.y2) this.hover = this.dragging = 'y2';
			if(this.dragging === 'y2' && update < this.scaled.y1) this.hover = this.dragging = 'y1';
			this.scaled[this.dragging] = update;
			
			// Scale up metrics:
			const metrics = {...this.metrics};
				metrics.x1 = this.scaled.x1 / this.scale.x;
				metrics.x2 = this.scaled.x2 / this.scale.x;
				metrics.y1 = this.scaled.y1 / this.scale.y;
				metrics.y2 = this.scaled.y2 / this.scale.y;
			this.$emit(updateMetrics, metrics);
		}
		function mouseup(e)
		{
			if(e.button !== Button.left) return;
			this.dragging = null;
			this.mouseDragging.isDragging = false;
		}
		function mouseleave()
		{
			this.dragging = null;
			this.mouseDragging.isDragging = false;
		}
	}
}

export default EditorMetricsMouseDragging;