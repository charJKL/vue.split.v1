const path = require('path');

module.exports = 
{
	publicPath: './',
	css: {
	loaderOptions: {
		sass: {
				additionalData: `@import "@/App.scss"; @import "@/components/editor/Editor.scss";`
			}
		}
	}
}