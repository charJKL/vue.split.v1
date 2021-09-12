import Hover from './EditorMetricsHover';
import {updateMetrics} from '../store';
import {cloneDeep} from 'lodash';

const dragging = {};
var location = {x: 0, y: 0};
var value = 0;


dragging.onLeftDown = function(e)
{
	if(this.isCurrent === null) return;
	if(this.hover === null) return;
	
	this.active = this.hover;
	location = {x: e.clientX, y: e.clientY};
	value = this.active.value;
}

dragging.onMove = function(e)
{
	if(this.isCurrent === false) return;
	if(this.active === null) return;
	const position = {x: e.clientX, y: e.clientY};
	const diff = {x: position.x - location.x, y: position.y - location.y};
	const displacement = this.hover.subtype === 'vertical' ? diff.x : diff.y;
	
	this.active.value = value + displacement;
	this.$store.dispatch(updateMetrics, cloneDeep(this.metrics));
}

dragging.onLeftUp = function(e)
{
	this.active = null;
	this.mouse = Hover;
	this.onMouseLeftUp.call(this, e);
}

export default dragging;