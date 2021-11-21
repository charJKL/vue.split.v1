import {setBlueprint} from '../store/ui';

const DefaultValuesMouseFocus = 
{
	data()
	{
		return {
			lock: false,
		}
	},
	methods:
	{
		onFocusinBlueprint(blueprint)
		{
			this.lock = true;
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onFocusoutBlueprint(blueprint)
		{
			this.lock = false;
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onMousemoveBlueprint(blueprint)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, blueprint);
		},
		onMouseleaveBlueprint(blueprint)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, blueprint);
		},
	}
}

export default DefaultValuesMouseFocus;