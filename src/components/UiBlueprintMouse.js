import {setBlueprint} from '../store/ui';

const UiBlueprintMouse = 
{
	data()
	{
		return {
			lock: false,
		}
	},
	methods:
	{
		onFocusinLine(key)
		{
			this.lock = true;
			this.$store.dispatch(setBlueprint, key);
		},
		onFocusoutLine(key)
		{
			this.lock = false;
			this.$store.dispatch(setBlueprint, key);
		},
		onMousemoveLine(key)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, key);
		},
		onMouseleaveLine(key)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, key);
		},
	}
}

export default UiBlueprintMouse;