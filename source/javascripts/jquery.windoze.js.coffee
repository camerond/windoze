# jQuery windoze Plugin
# http://github.com/camerond/windoze
# version 0.0.1
#
# Copyright (c) 2014 Cameron Daigle, http://camerondaigle.com
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(($) ->

  windoze =
    name: 'windoze'
    container: '#modal'
    delegate: false
    createModalOverlay: ->
      @$overlay = $('#modal_layer')
      if !@$overlay.length
        @$overlay = $('<div />').attr('id', 'modal_layer').appendTo($(document.body))
    createModalWindow: ->
      @$modal = $(@container)
      if !@$modal.length
        id = @container.match(/#([a-z0-9\-_]+)/gi)
        klass = @container.match(/\.([a-z0-9\-_]+)/gi)
        @$modal = $('<div />')
          .attr('id', if id then id.join().replace('#', ''))
          .addClass(if klass then klass.join(' ').replace(/\./g, ''))
          .appendTo($(document.body))
    show: ->
      @$modal.show()
      @$overlay.show()
      @bindModalEvents()
      @$modal.find(':input').eq(0).focus()
    hide: (e) ->
      if @$modal.find(':focus').length then return
      @$modal.hide()
      @$overlay.hide()
      @unbindModalEvents()
    open: ->
      $(@).data('windoze').show()
    close: ->
      $(@).data('windoze').hide()
    keydownHandler: (e) ->
      if e.which == 27
        @hide()
    bindModalEvents: ->
      @$overlay.on('click.wdz', $.proxy(@hide, @))
      @$modal.on('click.wdz', 'a[data-wdz-close]', $.proxy(@hide, @))
      $(document).off('keydown.wdz').on('keydown.wdz', $.proxy(@keydownHandler, @))
    unbindModalEvents: ->
      @$overlay.off('click.wdz')
      @$modal.off('click.wdz')
      $(document).off('keydown.wdz')
    bindTriggerEvents: ->
      @$el.on('click.wdz', @delegate, $.proxy(@show, @))
    init: ->
      @createModalOverlay()
      @createModalWindow()
      @bindTriggerEvents()
      @hide()
      @$el

  $.fn[windoze.name] = (opts) ->
    $els = @
    method = if $.isPlainObject(opts) or !opts then '' else opts
    if method and windoze[method]
      windoze[method].apply($els, Array.prototype.slice.call(arguments, 1))
    else if !method
      $els.each ->
        plugin_instance = $.extend(
          true,
          $el: $(@),
          windoze,
          opts
        )
        $(@).data(windoze.name, plugin_instance)
        plugin_instance.init()
    else
      $.error('Method #{method} does not exist on jQuery. #{windoze.name}');
    return $els;

)(jQuery)