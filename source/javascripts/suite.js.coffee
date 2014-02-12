(($) ->

  tester =
    use: (fixture) ->
      @fixture = fixture
    init: (opts)->
      @$fixture = $(@fixture || '.link_trigger')
      @$trigger = @$fixture.find('a').eq(0)
      $(@$trigger).windoze(opts)

  module 'Base Functionality'

  test 'it chains properly', ->
    $trigger = tester.init()
    deepEqual $trigger.hide().show(), $trigger, 'returns trigger properly'

)(jQuery)