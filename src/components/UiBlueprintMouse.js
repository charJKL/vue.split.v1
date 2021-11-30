import {selectBlueprint} from '../store/blueprints';

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
			this.$store.dispatch(selectBlueprint, draft);
		},
		onFocusoutLine(draft)
		{
			this.lock = false;
			this.$store.dispatch(selectBlueprint, draft);
		},
		onMouseenterLine(draft)
		{
			if(this.lock === true) return;
			this.$store.dispatch(selectBlueprint, draft);
		},
		onMouseleaveLine(draft)
		{
			if(this.lock === true) return;
			this.$store.dispatch(selectBlueprint, draft);
		},
	}
}

export default UiBlueprintMouse;