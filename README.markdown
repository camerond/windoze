# Windoze

A markup-minimal context menu / modal plugin for jQuery.

## Usage

Windoze is primarily for situations where a modal will perform an action that affects something on the page asynchronously (for example, an 'edit' modal that performs changes on the element that called it).

The Windoze modal markup is always appended to the end of the `body`, with `.data('wz_target')` providing a reference back to the element.

The `.wz_modal` function creates:

- `#wz_modal`
  - `#wz_flood` to dim the background
  - `#wz_window` which holds your loaded content

Any link with the id of `#wz_close` will close the modal. (So will `$.wz_clear()`)
  
The `.wz_popup` function creates:

- `#wz_popup` positioned over the clicked element
  - a series of anchors with id `#wz-btn-[text within anchor]`

And then you can write handlers, etc. to your heart's content. See the demo to actually see what's going on.

(Disclaimer: Windoze was written for a very specific purpose, so it probably doesn't do what you want it to do. Sorry ahead of time.)

### To Do Sometime (Never You Mind)

  - split positioning styles out from the demo styles so people don't go insane
  - settings for positioning wz_popup
  - href on .wz_modal class also works for calling modal
  - semantic action list for wz_popup
  - write this readme
