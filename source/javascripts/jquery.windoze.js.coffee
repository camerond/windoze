# jQuery Windoze Plugin
# http://github.com/camerond/windoze
# version 0.2.3
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
    container: ''
    delegate: false
    init_shown: false
    relocate_modal: true
    allow_outside_click: true
    allow_esc: true
    open: ->
      $(@).trigger('open.windoze')
    close: ->
      $(@).trigger('close.windoze')
    readDataAttributes: ->
      $el = @$el
      attrs = ['container', 'delegate', 'init_shown', 'relocate_modal', 'animation']
      detected_attrs = attrs.map((a) -> $el.attr("data-wdz-#{a}"))
      for attr, i in detected_attrs
        if attr
          @[attrs[i]] = switch
            when attr == 'true' then true
            when attr == 'false' then false
            else attr
    fireCallback: (name, event) ->
      @[name] && $.proxy(@[name], @)(@current_event)
    createModalOverlay: ->
      @$overlay = $('.wdz-overlay')
      if !@$overlay.length
        @$overlay = $('<div />').addClass('wdz-overlay').appendTo($(document.body))
      @overlay_duration = @detectTransitionDuration(@$overlay)
    createModalWindow: ->
      @$modal = $(".wdz-modal#{@container}").eq(0)
      if @$modal.length
        @relocate_modal && @$modal.detach().appendTo($(document.body))
      else
        id = @container.match(/#([a-z0-9\-_]+)/gi)
        klass = @container.match(/\.([a-z0-9\-_]+)/gi)
        @$modal = $('<div />')
          .attr('id', if id then id.join().replace('#', '') else @generateID())
          .addClass('wdz-modal')
          .addClass(if klass then klass.join(' ').replace(/\./g, ''))
          .appendTo($(document.body))
      @modal_duration = @detectTransitionDuration(@$modal)
      @$modal.data('windoze', @)
    changeTransitionType: ->
      @$modal.attr 'class', (i, c) -> c.replace(/\bwdz-animate\-\S+/g, '')
      if @animation
        @$modal.addClass("wdz-animate-#{@animation}")
    detectTransitionDuration: ($el) ->
      duration = +$el.css('transition-duration').split(' ')[0].replace(/([^0-9\.]+)/, '')
      if duration then duration * 1000 else false
    generateID: ->
      "wdz-#{('' + Math.random()).slice(2, 6)}"
    forceReflow: ->
      @$modal[0].offsetWidth
      @$overlay[0].offsetWidth
    showAll: (e) ->
      if @$modal.is(':visible') then return
      e.preventDefault()
      @current_event = e
      @fireCallback('beforeShow')
      $(document.body).addClass('wdz-modal-open')
      @hideOtherModals()
      @changeTransitionType()
      @$modal.add(@$overlay).show()
      @forceReflow()
      @$modal.add(@$overlay).addClass('wdz-active')
      if @modal_duration then setTimeout $.proxy(@showModal, @), @modal_duration else @showModal()
      e && @loadFromEvent(e)
    hideAll: (e) ->
      if !@$modal.is(':visible') then return
      e.preventDefault()
      @current_event = e
      @fireCallback('beforeClose')
      @$modal.removeClass('wdz-active')
      if @modal_duration then setTimeout $.proxy(@hideModal, @), @modal_duration else @hideModal()
      if !@keep_overlay
        @$overlay.removeClass('wdz-active')
        if @overlay_duration then setTimeout $.proxy(@hideOverlay, @), @overlay_duration else @hideOverlay()
    hideOtherModals: ->
      $('.wdz-active').not(@$modal).not(@$overlay).each ->
        other_wdz = $(@).data('windoze')
        if other_wdz
          other_wdz.keep_overlay = other_wdz.$overlay.is(':visible')
          $(@).trigger('close.windoze')
    showModal: (e) ->
      @fireCallback('afterShow')
      @$modal.find(':input').eq(0).focus()
      @bindModalEvents()
    hideModal: (e) ->
      @$modal.hide()
      @fireCallback('afterClose')
      @unbindModalEvents()
    hideOverlay: ->
      @$overlay.hide()
      $(document.body).removeClass('wdz-modal-open')
    loadFromEvent: (e) ->
      href = $(e.target).attr('href') || $(e.target).closest('a').attr('href')
      return if !href or href == '#'
      @$modal.addClass('wdz-loading')
      @fireCallback('beforeLoad')
      if href.match(/\.(gif|jpg|jpeg|png)$/)
        @loadImage href, e
      else
        @loadRemote href, e
    loadImage: (href) ->
      $img = $('<img />', { src: href }).on("load", $.proxy(->
        @$modal.removeClass('wdz-loading')
        @fireCallback('afterLoad')
      , @))
      @$modal.append($('<article />').append($img))
    loadRemote: (href) ->
      @$modal.load href, $.proxy(->
        @$modal.removeClass('wdz-loading')
        @fireCallback('afterLoad')
      , @)
    keydownHandler: (e) ->
      if e.which == 27
        if !@$modal.find(':focus').length then @$modal.trigger('close.windoze')
    outsideClickHandler: (e) ->
      $t = $(e.target)
      if $t.is(@$overlay) or $t.is(@$modal)
        e.stopPropagation()
        @$el.trigger('close.windoze')
    bindModalEvents: ->
      @$modal.on('click.wdz', 'a[data-wdz-close]', -> $(@).trigger('close.windoze'))
      if @allow_outside_click
        @$overlay.add(@$modal).on('click.wdz', $.proxy(@outsideClickHandler, @))
      $(document).off('keydown.wdz')
      if @allow_esc
        $(document).on('keydown.wdz', $.proxy(@keydownHandler, @))
    unbindModalEvents: ->
      @$modal.add(@$overlay).off('click.wdz')
      $(document).off('keydown.wdz')
    init: ->
      @readDataAttributes()
      @createModalOverlay()
      @$modal = if @$el.is('.wdz-modal') then @$el else @createModalWindow()
      @$modal.add(@$el)
        .off('.windoze')
        .on('open.windoze', $.proxy(@showAll, @))
        .on('close.windoze', $.proxy(@hideAll, @))
      @$el.on('click.windoze', @delegate, $.proxy(@showAll, @))
      !@init_shown && @$el.trigger('close.windoze')
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
      $.error("Method #{method} does not exist on jQuery. #{windoze.name}")
    return $els

)(jQuery)
