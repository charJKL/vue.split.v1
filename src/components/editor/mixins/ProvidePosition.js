const Button = {left: 1, right: 2};
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
	methods:
	{
		calcCenterPositionValue(viewport, size)
		{
			const x = (viewport.width - size.width) / 2;
			const y = (viewport.height - size.height) / 2;
			return {x: x, y: y};
		},
		mousedown(e)
		{
			if(this.isSource === false) return;
			if(e.button !== Button.right) return;

			this.providePosition.isMoving = true;
			this.providePosition.initalMouse = {x: e.clientX, y: e.clientY};
			this.providePosition.initalPosition = {...this.position};
		},
		mousemove(e)
		{
			if(this.isSource === false) return;
			if(this.providePosition.isMoving === false) return;
			
			const position = {x: e.clientX, y: e.clientY};
			const diff = {x: position.x - this.providePosition.initalMouse.x, y: position.y - this.providePosition.initalMouse.y};
		
			this.position.x = this.providePosition.initalPosition.x + diff.x;
			this.position.y = this.providePosition.initalPosition.y + diff.y;
		},
		mouseup(e)
		{
			if(e.button !== Button.right) return;
			this.providePosition.isMoving = false;
		},
		mouseleave()
		{
			this.providePosition.isMoving = false;
		},
		contextmenu(e)
		{
			e.preventDefault();
		}
	},
	mounted()
	{
		// There is no need to remove those listeners, will get lost with element.
		this.$el.addEventListener('mousedown', this.mousedown.bind(this));
		this.$el.addEventListener('mousemove', this.mousemove.bind(this));
		this.$el.addEventListener('mouseup', this.mouseup.bind(this));
		this.$el.addEventListener('mouseleave', this.mouseleave.bind(this));
		this.$el.addEventListener('contextmenu', this.contextmenu.bind(this));
	}
}

export default ProvidePosition;