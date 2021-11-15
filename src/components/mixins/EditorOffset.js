import {record} from '../../store/records';
import {cloneDeep} from 'lodash';


const EditorOffset = 
{
	data()
	{
		return {
			offseted: cloneDeep(record.metrics),
			offset: {x: 0, y: 0},
		}
	},
	watch:
	{
		source(old, value) // eslint-disable-line no-unused-vars
		{
			this.calcOffset(this.current.size, this.local.rotate.value);
		},
		metrics(old, value) // eslint-disable-line no-unused-vars
		{
			this.calcOffset(this.current.size, this.local.rotate.value);
			this.calcOffseted();
		}
	},
	created()
	{
		if(this.local === undefined) throw new Error('`EditorOffset` mixing must be used with `EditorBase` mixin.');
	},
	methods:
	{
		calcOffset(size, rotation)
		{
			this.offset = this.calcOffsetValue(size, rotation);
		},
		calcOffseted()
		{
			this.offseted.x1.value = this.local.x1.value + this.offset.x;
			this.offseted.x2.value = this.local.x2.value + this.offset.x;
			this.offseted.y1.value = this.local.y1.value + this.offset.y;
			this.offseted.y2.value = this.local.y2.value + this.offset.y;
			this.offseted.rotate.value = this.local.rotate.value;
		},
		calcOffsetValue(size, rotation)
		{
			const radians = rotation * Math.PI / 180;
			let x = size.width / 2;
			let y = size.height / 2;
			let nx = x * Math.cos(radians) + y * Math.sin(radians);
			let ny = x * Math.sin(radians) + y * Math.cos(radians);
			return { x: Math.abs(x - nx)*-1, y: Math.abs(y - ny)*-1 };
		}
	}
}

export default EditorOffset;