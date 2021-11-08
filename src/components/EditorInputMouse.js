import {isMatch} from '../lib/isMatch';
import EditorInputMouseFocus from './EditorInputMouseFocus';

const EditorInputMouse = 
{
	data()
	{
		return {
			mouse: EditorInputMouseFocus
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
	}
}

export default EditorInputMouse;