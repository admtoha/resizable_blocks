# resizable_blocks

![Illustration](https://admtoha.is-a.dev/static/public_files/614/2025_12_14_.gif)

This script allows you to add the ability for users to resize specified blocks on your website in an intuitive way: simply by dragging the mouse cursor on the edge or corner of these blocks (or using touch equivalents on mobile devices).

<b> ver. 2025-12-27 </b>

<h2>Interactive Demo</h2>
<a href='https://admtoha.is-a.dev/html/demo_resizable_blocks.html'>https://admtoha.is-a.dev/html/demo_resizable_blocks.html</a>

<h2>How to Use</h2>
1. Connect the <b>resizable_blocks.js</b> file to your page:

There are several ways to achieve this:
-  the classic approach using HTML (don't forget the attribute <b><i> type="module" </i></b>) 

```html
<script language="JavaScript" type="module" src="./resizable_blocks.js"></script>
```
- by connecting an ES module in JavaScript

```javascript

import './resizable_blocks.js';

// or

import make_resizable from './resizable_blocks.js';

// or

const make_resizable = await import('./resizable_blocks.js');

```

2. Specify the target blocks with the <b>data-resizable-blocks</b> attribute and populate its value with options, separated by commas, indicating the active (user-interactive) sides and corners.
Example:
```html
<!-- Sets the right side, bottom side, and right-bottom corner as active -->
<div data-resizable-blocks='right, bottom, right-bottom, remember'> ... </div>
```

<h3>All available options</h3>
 
  - <b>top</b> - top side of the block
  - <b>right</b> - right side
  - <b>bottom</b> - bottom side
  - <b>left</b> - left side
  - <b>left-top</b> - left-top corner
  - <b>left-bottom</b> - left-bottom corner
  - <b>right-top</b> - right-top corner
  - <b>right-bottom</b> - right-bottom corner
  - <b>active_size: size*</b> - The size (in pixels) of the "active zone" (default: 25). This refers to the size of the interactive space on the edge of the target block.
  - <b>remember</b> - enables the ability to remember the block size. This means that upon page reload (or creation of a dynamic block with the same ID), the last height and width values are automatically restored. Requires the target block to have an ID

By default, if no active sides and corners are specified, the value right, bottom, right-bottom is set.

<h3>Browser support</h3>
Tested in desktop and mobile versions of Firefox and Chrome, and their main derivatives. Unfortunately, browsers in the Safari family could not be tested. (I will check and update this point as soon as possible).

<h3>Dynamic page changes are supported</h3>

 - You can programmatically create a block with the "data-resizable-blocks" attribute and place it on the page, and the script will work perfectly.
   ```javascript
	// Example:
	const container = document.createElement('div');
	container.id = 'resizable_div';
	container.setAttribute('data-resizable-blocks', 'right, remember');
	document.body.append(container);
   ```
 - It is also possible to enable the script for blocks already located on the page by setting that attribute for them.
   ```javascript
	// Example:
	document.getElementById('resizable_div').setAttribute('data-resizable-blocks', 'right, bottom, remember');
   ```
 - You can disable the script for involved blocks by simply removing the corresponding "data-resizable-blocks" attribute.
   ```javascript
	// Example:
	document.getElementById('resizable_div').removeAttribute('data-resizable-blocks');
   ```
 - It is also possible to change the script's behavior "on the fly" by simply changing the value of the "data-resizable-blocks" attribute to a new one.
   ```javascript
	// Example:
	document.getElementById('resizable_div').setAttribute('data-resizable-blocks', 'right');
	//...
	document.getElementById('resizable_div').setAttribute('data-resizable-blocks', 'right, bottom, right-bottom, remember');
   ```

<h3>If necessary, you can directly access the block handling function:</h3>

```javascript
make_resizable(node, options)
 Arguments:
    *   node: (HTMLElement) - The target node.
    *   [options]: (Object) - Options.
        *   zone_ls: (Array) - List of active zone names (default: ['right', 'right-bottom', 'bottom']).
        *   active_size: (Number Integer) - Size/width of active zones in pixels (default: 25).
        *   remember: (Boolean) enables the ability to remember the block size. This means that upon page reload (or creation of a dynamic block with the same ID),
		the last height and width values are automatically restored. Requires the target block to have an ID (default: false)
 Return:
    *  (Object) - An object representing the controller, providing the following capabilities:
			{
				is_on: - (boolean) a flag indicating whether the script is enabled for the target block.
				
				off(): - (function) disables the script.
					Takes no arguments. Returns: undefined
				
				on(): - (function) enables the script if it was previously disabled.
					Takes no arguments. Returns: undefined
					
				remake(new_options): - (function) replaces the options with new ones, effectively changing the script's behavior according to the new options.
					Arguments:
						new_options - (Object)  the new options; essentially, these are the same options used for the make_resizable()
					Return: undefined
			}
```
