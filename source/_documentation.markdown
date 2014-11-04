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

One note here: the default Windoze stylesheet expects any existing `.wdz-modal` elements to be located at the end of the `<body>`, and the plugin will relocate said elements there by default on initialization. Outside of style inheritance & z-index issues, the plugin itself doesn't care where the modal element is in the DOM, so you can turn this off via an option if you prefer.

# Built-in animations.

Windoze uses CSS3 animations exclusively. You can specify which animation to use via a `data-wdz-animation` on the trigger or an `animation` option in the Javascript – both just toggle a `.wdz-animation-*` class (for example, a `slide-left` option results in toggling a `.wdz-animation-slide-left` class) – so a new animation is as easy as writing a new CSS class.

# Smart callbacks.

Windoze has a wealth of callbacks (listed below), and you don't have to pass any duration parameters - they're timed according to the transition speed specified in the CSS.

# Smart image lightboxing.

If your anchor links directly to an image, there's no need to load a partial or build your own markup – Windoze will load that image directly into an `article` element for you.

# Easy operation.

Open the modal via `$el.windoze('open')`, `$el.trigger('open.windoze')`, or `$modal.trigger('open.windoze')`.

Close it by clicking any anchor in the modal with a `data-wdz-close` attribute, or via `$el.windoze('close')`, `$el.trigger('close.windoze')`, or `$modal.trigger('close.windoze')`.

# Easy trigger delegation.

If you want Windoze to fire from an anchor that's not in the DOM yet, rather than dealing with callbacks, you can delegate Windoze to a parent element:

```javascript
$('.cool_container').windoze({
  delegate: 'a.cool_link'
});
```

# Plus, it's tested.

Sleep easy knowing that Windoze is covered by a [pretty comprehensive QUnit suite](https://github.com/camerond/windoze/blob/master/source/javascripts/suite.js.coffee).

# Option Reference

You can also set any of the following options (except the callback functions) via `data-wdz` attributes on the element triggering the modal, e.g. `data-wdz-animation='pop-down'`.

```javascript
$foo.windoze({

  // toggles animation class of wdz-animation-[x] (defaults to fade)
  // other built-in options are slide-top, slide-left and pop-down
  animation: ''

  // additional classes/IDs for container (selector string)
  container: '',

  // relocate the matching .wdz-modal element to the end of the <body>
  // upon initialization
  relocate_modals: true,

  // delegate trigger event (selector string)
  delegate: '',

  // load the page with this modal shown
  init_shown: false,

  // expect image data as response to the AJAX call, and lightbox it.
  // this is set automatically if the URL ends in an image extension,
  // but in certain cases (e.g. linking to a Filepicker response)
  // it needs to be set manually
  lightbox: false,

  // automatically focus the first input in the modal
  focus_on_show: true,

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
