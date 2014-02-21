(($) ->

  # fix for finding focused elements in an inactive window
  jQuery.expr[":"].absfocus = jQuery.expr.createPseudo ->
    return (elem) ->
      doc = elem.ownerDocument;
      elem == doc.activeElement && !!(elem.type || elem.href);

  $.fn.selectorText = () ->
    selector = "%#{@[0].tagName.toLowerCase()}"
    @attr('id') && selector += "##{@.attr('id')}"
    @attr('class') && selector += ".#{@.attr('class')}"
    text = if @text().length > 20 then "#{@text().slice(0, 20)}..." else @text()
    if text then selector = selector + " with text of '#{text}'"
    selector

  $.fn.shouldBe = (attr, msg) ->
    state = true
    @each ->
      state = $(@).is(attr)
      ok state, msg or "#{$(@).selectorText()} should be #{attr}"
      state
    @

  $.fn.shouldNotBe = (attr, msg) ->
    state = true
    @each ->
      state = !$(@).is(attr)
      ok state, msg or "#{$(@).selectorText()} should not be #{attr}"
      state
    @

  $.fn.shouldSay = (text, msg) ->
    equal @text(), text, msg or "#{text} is displayed within #{@selectorText()}"
    @

  $.fn.shouldEqual = ($el) ->
    ok $(@).length == 1 && $el.length == 1, 'checking for element duplication'
    equal $(@)[0], $el[0], "#{$(@).selectorText()} is equal to #{$el.selectorText()}"
    @

  $.fn.pressKey = (k, msg) ->
    if (msg)
      ok(true, "I press " + msg);
    $e = $.Event('keydown')
    $e.keyCode = $e.which = k
    $(@).trigger($e)

  tester =
    data: ->
      @$trigger.data('windoze')
    verifyHidden: ->
      @data().$modal.shouldBe(':hidden')
      @data().$overlay.shouldBe(':hidden')
    verifyVisible: ->
      @data().$modal.shouldBe(':visible')
      @data().$overlay.shouldBe(':visible')
    createElements: (text) ->
      text ||= 'some text'
      $(document.body)
        .append($('<div />').attr('class', 'wdz-modal').text(text))
        .append($('<div />').attr('class', 'wdz-overlay'))
    reset: ->
      $('body > *').not("[id^='qunit-']").remove()
      @$fixture = false
    use: (selector) ->
      @$fixture = $(selector)
      @$fixture.siblings().remove()
    init: (opts, $el)->
      defaults =
        duration:
          modal: 0
          overlay: 0
      if !@$fixture then @use('.link_trigger')
      @$trigger = $el || @$fixture.find('a').eq(0)
      @$trigger.windoze($.extend(defaults, opts))

  QUnit.testDone $.proxy(tester.reset, tester)

  module 'Element Creation'

  test 'it chains properly', ->
    $trigger = tester.init()
    deepEqual $trigger.hide().show(), $trigger, 'returns trigger properly'

  test 'it uses .wdz-modal and .wdz-overlay if present', ->
    tester.createElements()
    $trigger = tester.init()
    tester.data().$modal
      .shouldEqual($('.wdz-modal'))
      .shouldSay('some text')

  test 'it creates a default .wdz-modal and .wdz-overlay if not present', ->
    $trigger = tester.init()
    tester.data().$modal
      .shouldEqual($('.wdz-modal'))
      .shouldSay('')
    tester.data().$overlay.shouldEqual($('.wdz-overlay'))

  test 'any created .wdz-modal has a unique id', ->
    $trigger = tester.init()
    ok tester.data().$modal.attr('id').match(/\bwdz-\d{4}\b/), 'modal has an id of wdz-[4 digits]'

  test 'it uses a particular element if one is specified', ->
    $(document.body).append($('<div />').addClass('wdz-modal').attr('id', 'other_modal').text('foo'))
    $trigger = tester.init(
      container: '#other_modal'
    )
    tester.data().$modal
      .shouldEqual($('.wdz-modal#other_modal'))
      .shouldSay('foo')

  test 'it creates a particular element if one is specified and does not exist', ->
    $trigger = tester.init(
      container: '#other_modal.some_class'
    )
    tester.data().$modal
      .shouldEqual($('#other_modal.some_class'))
      .shouldSay('')

  module 'Triggering'

  test 'clicking an anchor with an href of `#` opens non-ajax modal', ->
    tester.createElements()
    $trigger = tester.init()
    tester.verifyHidden()
    $trigger.click()
    tester.verifyVisible()
    tester.data().$modal
      .shouldEqual($('.wdz-modal'))
      .shouldSay('some text')

  test 'passing `open` should open modal', ->
    $trigger = tester.init()
    $trigger.windoze('open')
    tester.verifyVisible()

  test 'clicking on the overlay closes the modal', ->
    $trigger = tester.init()
    $trigger.click()
    tester.verifyVisible()
    tester.data().$overlay.click()
    tester.verifyHidden()

  test 'clicking on any anchor inside modal with [data-wdz-close] closes the modal', ->
    tester.createElements()
    $('.wdz-modal').append("<a href='#' data-wdz-close>close</a>")
    $('body').append("<a href='#' data-wdz-close>close</a>")
    $trigger = tester.init()
    $trigger.click()
    tester.verifyVisible()
    $('body > a').click()
    tester.verifyVisible()
    $('.wdz-modal a').click()
    tester.verifyHidden()

  test 'typing `esc` should close modal', ->
    $trigger = tester.init()
    $trigger.click()
    $(document).pressKey(27, 'escape')
    tester.verifyHidden()

  test 'passing `close` should close modal', ->
    $trigger = tester.init()
    $trigger.click()
    $trigger.windoze('close')
    tester.verifyHidden()

  test 'calling windoze() with a selector delegates to children', ->
    tester.use('.delegated_trigger')
    $trigger = tester.init({
      delegate: 'a.trigger'
    }, $('.delegated_trigger'))
    $trigger.click()
    $trigger.find('a.one').click()
    tester.verifyHidden()
    $trigger.find('a.two.trigger').click()
    tester.verifyVisible()
    $trigger.windoze('close')
    tester.verifyHidden()
    $trigger.append($("<a href='#' class='three trigger'></a>"))
    $trigger.find('a.three.trigger').click()
    tester.verifyVisible()

  test 'opening a second modal maintains shared overlay', ->
    tester.createElements()
    $('.wdz-modal').append($("<a class='trigger2' href='#'>trigger 2</a>"))
    $('a.trigger2').windoze({
      container: '.two'
      duration:
        modal: 0
        overlay: 0
    })
    tester.init().click()
    $('.wdz-modal a').click()
    $('.wdz-overlay, .wdz-modal.two').shouldBe(':visible')
    $('.wdz-modal').not('.two').shouldNotBe(':visible')

  module 'Form Elements',
    setup: ->
      tester.createElements()
      $('.wdz-modal').append($('<input />').attr('type', 'text'))

  test 'the first input/textarea should be focused when modal is shown', ->
    $trigger = tester.init()
    $trigger.click()
    tester.data().$modal.find('input').shouldBe(':absfocus')
    tester.data().$overlay.click()
    tester.data().$modal.prepend($('<textarea />'))
    $trigger.click()
    tester.data().$modal.find('textarea').shouldBe(':absfocus')
    tester.data().$modal.text('foobar')

  test 'typing `esc` when input is focused should not close modal', ->
    $trigger = tester.init()
    $trigger.click()
    $(document).pressKey(27, 'escape')
    tester.verifyVisible()
    tester.data().$modal.find('input').trigger('blur')
    $(document).pressKey(27, 'escape')
    tester.verifyHidden()

  module 'Remote load'

  asyncTest 'calling windoze() on a link with an href loads a remote file', ->
    tester.use('.remote_load')
    $trigger = tester.init({
      afterLoad: ->
        start()
    });
    $trigger.click()
    tester.verifyVisible()

  asyncTest 'calling windoze() on a delegated link loads a remote file', ->
    tester.use('.remote_load')
    $trigger = tester.init({
      delegate: 'a'
      afterLoad: ->
        start()
    }, $('.remote_load'));
    $trigger.find('a').click()
    tester.verifyVisible()

  module 'Options'

  test 'show when initialized', ->
    tester.init({
      init_shown: true
    })
    tester.verifyVisible()

  test 'data attribute support', ->
    $('.link_trigger a')
      .attr('data-wdz-delegate', 'true')
      .attr('data-wdz-init_shown', 'true')
      .attr('data-wdz-container', '#foo')
    wdz = tester.init().data('windoze')
    equal wdz.delegate, true, 'delegate is set to true'
    equal wdz.init_shown, true, 'init_shown is set to true'
    equal wdz.container, '#foo', 'container is set to #foo'

)(jQuery)