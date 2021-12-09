import Button from '../../../lib/Button';

const ProvidePosition = {
	data()
	{
		return {
			position: {x: 0, y: 0},
			providePosition: {
				isMoving: false,
				initalMouse: {x: 0, y: 0},
				initalPosition: {x: 0, y: 0},
				threshold: 3,
			}
		}
	},
	watch:
	{
		'providePosition.isMoving': function(isMoving)
		{
			if(isMoving === true) this.$el.classList.add('cursor-moving');
			if(isMoving === false) this.$el.classList.remove('cursor-moving');
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
	},
	mounted()
	{
		// There is no need to remove those listeners, will get lost with element.
		this.$el.addEventListener('mousedown', mousedown.bind(this));
		this.$el.addEventListener('mousemove', mousemove.bind(this));
		this.$el.addEventListener('mouseup', mouseup.bind(this));
		this.$el.addEventListener('mouseleave', mouseleave.bind(this));
		this.$el.addEventListener('contextmenu', contextmenu.bind(this));
		
		function mousedown(e)
		{
			if(this.isSource === false) return;
			if(e.button !== Button.right) return;

			this.providePosition.isMoving = true;
			this.providePosition.initalMouse = {x: e.clientX, y: e.clientY};
			this.providePosition.initalPosition = {...this.position};
		}
		function mousemove(e)
		{
			if(this.isSource === false) return;
			if(this.providePosition.isMoving === false) return;
			
			const position = {x: e.clientX, y: e.clientY};
			const diff = {x: position.x - this.providePosition.initalMouse.x, y: position.y - this.providePosition.initalMouse.y};
		
			this.position.x = this.providePosition.initalPosition.x + diff.x;
			this.position.y = this.providePosition.initalPosition.y + diff.y;
		}
		function mouseup(e)
		{
			if(e.button !== Button.right) return;
			this.providePosition.isMoving = false;
		}
		function mouseleave()
		{
			this.providePosition.isMoving = false;
		}
		function contextmenu(e)
		{
			e.preventDefault();
		}
	}
}

export default ProvidePosition;