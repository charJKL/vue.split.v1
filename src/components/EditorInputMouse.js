import {isMatch} from '../lib/isMatch';
import EditorInputMouseFocus from './EditorInputMouseFocus';
import {setFocus} from '../store/ui';

const EditorInputMouse = 
{
	data()
	{
		return {
			mouse: EditorInputMouseFocus,
			focus: null,
		}
	},
	computed:
	{
		onFocus()
		{
			return this.mouse.focus.bind(this);
		},
		onInput()
		{
			return this.mouse.input.bind(this);
		},
		onBlur()
		{
			return this.mouse.blur.bind(this);
		}
	},
	watch:
	{
		mouse(old, value)
		{
			if(isMatch(old, value) === false) throw new Error("Mouse events object doesn't match");
		}
	},
	methods:
	{
		onSourceFocus()
		{
			this.$store.dispatch(setFocus, 'source');
		},
		onSourceBlur()
		{
			this.$store.dispatch(setFocus, '');
		}
	}
}

export default EditorInputMouse;