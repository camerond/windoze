# Windoze

Visit [http://camerond.github.io/windoze/](http://camerond.github.io/windoze/) for documentation & examples.

### A note about positioning

Windoze uses a positioning trick from Twitter Bootstrap's implementation. If you're interested, here's how it works:

- The modal layer itself is fixed position and spans the entire viewport
- The element you think of as the modal itself is absolutely positioned within the modal layer
- When the modal is open, scrolling is turned __off__ on the `<body>` and __on__ on the modal layer

With this strategy, the modal element is effectively 'fixed' (stays the same position on the screen) while still scrolling properly if it's taller than the viewport (since it's actually absolutely positioned within a fixed element). So when the modal is open and you're scrolling, you're actually scrolling the modal layer, not the window. The advantage to this approach is that it seamlessly handles modals taller than the viewport.

I hope that makes sense. The modal plugin is position-agnostic and all of that happens in the accompanying stylesheet, so you shouldn't have to worry about it, aside from making sure your content is in an `<article>` within the `wdz-modal` element in order to position properly.

### Option Reference

You can also set any of the following options (except the callback functions) via `data-wdz` attributes on the element triggering the modal, e.g. `data-wdz-animation='pop-down'`.

```javascript
$foo.windoze({

  // toggles animation class of wdz-animation-[x] (defaults to fade)
  // other built-in options are slide-top, slide-left and pop-down
  animation: ''

  // additional classes/IDs for container (selector string)
  container: '',

  // delegate trigger event (selector string)
  delegate: '',

  // load the page with this modal shown
  init_shown: false,

  // before/after modal animates open
  beforeShow: $.noop,
  afterShow: $.noop,

  // before/after modal animates closed
  beforeClose: $.noop,
  afterClose: $.noop,

  // before AJAX load and after it completes
  beforeLoad: $.noop,
  afterLoad: $.noop

});
```