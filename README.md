# resizable_blocks
This script allows you to add the ability for users to resize specified blocks on your website in an intuitive way: simply by dragging the mouse cursor on the edge or corner of these blocks (or using touch equivalents on mobile devices).

<h2>Interactive Demo</h2>
<a href='https://admtoha.is-a.dev/html/demo_resizable_blocks.html'>https://admtoha.is-a.dev/html/demo_resizable_blocks.html</a>

<h2>How to Use</h2>
1. Connect the `resizable_blocks.js` file to your page:

```html
<script language="JavaScript" src="./resizable_blocks.js"></script>
```

2. Specify the target blocks with the data-resizable-blocks attribute and populate its value with options, separated by commas, indicating the active (user-interactive) sides and corners.
Example:
```html
<!-- Sets the right side, bottom side, and right-bottom corner as active -->
<div data-resizable-blocks='right, bottom, right-bottom'> ... </div>
```

<h3>All available options</h3>
 
  - top - top side of the block
  - right - right side
  - bottom - bottom side
  - left - left side
  - left-top - left-top corner
  - left-bottom - left-bottom corner
  - right-top - right-top corner
  - right-bottom - right-bottom corner
  - active_size: size* - The size (in pixels) of the "active zone" (default: 25). This refers to the size of the interactive space on the edge of the target block.

By default, if no active sides and corners are specified, the value right, bottom, right-bottom is set.

<h3>Notes</h3>
Dynamic page changes are supported. In other words, you can create target blocks programmatically with the corresponding attributes, place them on the page, and they will work correctly.  Note: attributes must be set *before* the blocks are placed on the page.

<h3>If necessary, you can directly access the block handling function:</h3>

```javascript
make_resizable(node, options)
 Arguments:
    *   node: (HTMLElement) - The target node.
    *   [options]: (Object) - Options.
        *   zone_ls: (Array) - List of active zone numbers (default: ['right', 'right-bottom', 'bottom']).
        *   active_size: (Number Integer) - Size/width of active zones in pixels (default: 25).
 Return:
    *   undefined
```
