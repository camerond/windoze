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
    duration:
      modal: 300
      overlay: 150
    fireCallback: (name) ->
      @[name] && $.proxy(@[name], @)()
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
    showAll: (e) ->
      @fireCallback('beforeShow')
      @$modal.show()
      @$overlay.show()
      if @duration.modal then setTimeout $.proxy(@showModal, @), @duration.modal else @showModal()
      if @duration.overlay then setTimeout $.proxy(@showOverlay, @), @duration.overlay else @showOverlay()
      @bindModalEvents()
      @$modal.find(':input').eq(0).focus()
      if e
        e.preventDefault()
        @loadRemote($(e.target).attr('href'))
    hideAll: (e) ->
      e && e.preventDefault()
      @fireCallback('beforeClose')
      @$modal.removeClass('wdz-active')
      @$overlay.removeClass('wdz-active')
      if @duration.modal then setTimeout $.proxy(@hideModal, @), @duration.modal else @hideModal()
      if @duration.overlay then setTimeout $.proxy(@hideOverlay, @), @duration.overlay else @hideOverlay()
      @unbindModalEvents()
    showModal: ->
      @$modal.addClass('wdz-active')
      @fireCallback('afterShow')
    showOverlay: ->
      @$overlay.addClass('wdz-active')
    hideModal: ->
      @$modal.hide()
      @fireCallback('afterClose')
    hideOverlay: ->
      @$overlay.hide()
    loadRemote: (href) ->
      if href != '#'
        @fireCallback('beforeLoad')
        @$modal.addClass('wdz-loading')
        @$modal.load href, $.proxy(@loadComplete, @)
    loadComplete: ->
      @$modal.removeClass('wdz-loading')
      @fireCallback('afterLoad')
    open: ->
      $(@).data('windoze').showAll()
    close: ->
      $(@).data('windoze').hideAll()
    keydownHandler: (e) ->
      if e.which == 27
        if !@$modal.find(':focus').length then @hideAll()
    bindModalEvents: ->
      @$overlay.on('click.wdz', $.proxy(@hideAll, @))
      @$modal.on('click.wdz', 'a[data-wdz-close]', $.proxy(@hideAll, @))
      $(document).off('keydown.wdz').on('keydown.wdz', $.proxy(@keydownHandler, @))
    unbindModalEvents: ->
      @$overlay.off('click.wdz')
      @$modal.off('click.wdz')
      $(document).off('keydown.wdz')
    bindTriggerEvents: ->
      @$el.on('click.wdz', @delegate, $.proxy(@showAll, @))
    init: ->
      @createModalOverlay()
      @createModalWindow()
      @bindTriggerEvents()
      @hideAll()
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