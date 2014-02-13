(($) ->

  $.fn.selectorText = () ->
    selector = "%#{@[0].tagName.toLowerCase()}"
    @attr('id') && selector += "##{@.attr('id')}"
    @attr('class') && selector += ".#{@.attr('class')}"
    text = if @text().length > 20 then "#{@text().slice(0, 20)}..." else @text()
    if text then selector = selector + " with text of '#{text}'"
    selector

  $.fn.shouldEqual = ($el) ->
    ok $(this).length == 1 && $el.length == 1, 'checking for element duplication'
    equal $(this)[0], $el[0], "#{$(this).selectorText()} is equal to #{$el.selectorText()}"

  tester =
    data: ->
      @$trigger.data('windoze')
    createElements: (text) ->
      text ||= 'some text'
      $(document.body)
        .append($('<div />').attr('id', 'modal').text(text))
        .append($('<div />').attr('id', 'modal_layer'))
    init: (opts)->
      @$fixture = $(@fixture || '.link_trigger')
      @$trigger = @$fixture.find('a').eq(0)
      $(@$trigger).windoze(opts)

  module 'Element Creation'

  test 'it chains properly', ->
    $trigger = tester.init()
    deepEqual $trigger.hide().show(), $trigger, 'returns trigger properly'

  test 'it uses #modal and #modal_layer if present', ->
    $trigger = tester.init()
    tester.data().$modal.shouldEqual($('#modal'))

  test 'it creates a default #modal and #modal_layer if not present', ->
    $('#modal, #modal_layer').remove()
    $trigger = tester.init()
    tester.data().$modal.shouldEqual($('#modal'))
    tester.data().$overlay.shouldEqual($('#modal_layer'))

  test 'it uses a particular element if one is specified', ->
    $(document.body).append($('<div />').attr('id', 'other_modal').text('foo'))
    $trigger = tester.init(
      container: '#other_modal'
    )
    tester.data().$modal.shouldEqual($('#other_modal'))

  test 'it creates a particular element if one is specified and does not exist', ->
    $trigger = tester.init(
      container: '#other_modal.some_class'
    )
    tester.data().$modal.shouldEqual($('#other_modal.some_class'))

)(jQuery)