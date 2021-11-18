import {record} from '../../store/records';
import {cloneDeep} from 'lodash';

const EditorScale = 
{
	data()
	{
		return {
			scaled: cloneDeep(record.metrics),
			mode: {width: 'auto', height:'auto'},
			viewport: {width: 0, height: 0},
			scale: {x: 1.0, y: 1.0}
		}
	},
	watch:
	{
		source: {
			immediate: true,
			handler(value)
			{
				if(value === null) return;
				this.calcScale();
				this.calcScaled();
			}
		},
		metrics: {
			immediate: true,
			handler(value)
			{
				if(value === null) return;
				this.calcScale();
				this.calcScaled();
			}
		}
	},
	methods:
	{
		calcScale()
		{
			this.scale = this.calcScaleValue(this.viewport, this.mode, this.current.size);
		},
		calcScaled()
		{
			this.scaled.x1.value = this.local.x1.value * this.scale.x;
			this.scaled.x2.value = this.local.x2.value * this.scale.x;
			this.scaled.y1.value = this.local.y1.value * this.scale.y;
			this.scaled.y2.value = this.local.y2.value * this.scale.y;
			this.scaled.rotate.value = this.local.rotate.value;
		},
		calcScaleValue(viewport, mode, image)
		{
			const width = viewport.width;
			const height = viewport.height;
			const x = width / image.width;
			const y = height / image.height;
			if(mode.width == 'auto' && mode.height == 'auto')
			{
				const scale = Math.min(x, y);
				return {x: scale, y: scale};
			}
			return {x: x, y: y};
		}
	}
}

export default EditorScale;