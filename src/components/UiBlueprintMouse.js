import {setBlueprint} from '../store/blueprints';

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
		onFocusinLine(draft)
		{
			this.lock = true;
			this.$store.dispatch(setBlueprint, draft);
		},
		onFocusoutLine(draft)
		{
			this.lock = false;
			this.$store.dispatch(setBlueprint, draft);
		},
		onMouseenterLine(draft)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, draft);
		},
		onMouseleaveLine(draft)
		{
			if(this.lock === true) return;
			this.$store.dispatch(setBlueprint, draft);
		},
	}
}

export default UiBlueprintMouse;