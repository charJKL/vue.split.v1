import {record} from '../../store/records';
import {cloneDeep} from 'lodash';

const EditorScale = 
{
	data()
	{
		return {
			scaled: cloneDeep(record.metrics),
			viewport: {width: 0, height: 0},
			margin: { top: 0, right: 0, bottom: 0, left: 0 },
			scale: 1.0,
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
			this.scale = this.calcScaleValue(this.viewport, this.margin, this.current.size);
		},
		calcScaled()
		{
			this.scaled.x1.value = this.local.x1.value * this.scale;
			this.scaled.x2.value = this.local.x2.value * this.scale;
			this.scaled.y1.value = this.local.y1.value * this.scale;
			this.scaled.y2.value = this.local.y2.value * this.scale;
			this.scaled.rotate.value = this.local.rotate.value;
		},
		calcScaleValue(viewport, margin, image)
		{
			const width = viewport.width - margin.left - margin.right;
			const height = viewport.height - margin.top - margin.bottom;
			const x = width / image.width;
			const y = height / image.height;
			return Math.min(x, y);
		}
	}
}

export default EditorScale;