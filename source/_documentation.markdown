---
layout: default
---

# Smart AJAX loading.

If the anchor that triggers a Windoze modal has an `href` that isn't just `#`, Windoze will load the contents of that `href` into the modal automatically.

# On-the-fly modal creation.

If a `container` option isn't specified, Windoze looks for a `.wdz-modal` already on the page. If there isn't one, it'll create a new one on the fly (and load into it from the `href`). You can add additional classes via the `container` option. For example, this will look for (or create) a `.wdz-modal` with an additional id of `hammer` and class of `pants`:

```javascript
$('a.cool_link').windoze({
  container: '#hammer.pants'
});
```

So will this:

```html
<a href='#' data-wdz-container='#hammer.pants'>Stop. Hammertime.</a>
```

# Built-in animations.

Windoze uses CSS3 animations exclusively. You can specify which animation to use via a `data-wdz-animation` on the trigger or an `animation` option in the Javascript – both just toggle a `.wdz-animation-*` class (for example, a `slide-left` option results in toggling a `.wdz-animation-slide-left` class) – so a new animation is as easy as writing a new CSS class.

# Smart callbacks.

Windoze has a wealth of callbacks (listed below), and you don't have to pass any duration parameters - they're timed according to the transition speed specified in the CSS.

# Easy operation.

You can open the modal directly by calling `.windoze('open')`, and close it by calling `.windoze('close')` or clicking any anchor with a `data-wdz-close` attribute.

# Easy trigger delegation.

If you want Windoze to fire from an anchor that's not in the DOM yet, rather than dealing with callbacks, you can delegate Windoze to a parent element:

```javascript
$('.cool_container').windoze({
  delegate: 'a.cool_link'
});
```

# Option Reference

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
