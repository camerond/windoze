(function() {
  (function($) {
    var tester;

    jQuery.expr[":"].absfocus = jQuery.expr.createPseudo(function() {
      return function(elem) {
        var doc;

        doc = elem.ownerDocument;
        return elem === doc.activeElement && !!(elem.type || elem.href);
      };
    });
    $.fn.selectorText = function() {
      var selector, text;

      selector = "%" + (this[0].tagName.toLowerCase());
      this.attr('id') && (selector += "#" + (this.attr('id')));
      this.attr('class') && (selector += "." + (this.attr('class')));
      text = this.text().length > 20 ? "" + (this.text().slice(0, 20)) + "..." : this.text();
      if (text) {
        selector = selector + (" with text of '" + text + "'");
      }
      return selector;
    };
    $.fn.shouldBe = function(attr, msg) {
      var state;

      state = true;
      this.each(function() {
        state = $(this).is(attr);
        ok(state, msg || ("" + ($(this).selectorText()) + " should be " + attr));
        return state;
      });
      return this;
    };
    $.fn.shouldNotBe = function(attr, msg) {
      var state;

      state = true;
      this.each(function() {
        state = !$(this).is(attr);
        ok(state, msg || ("" + ($(this).selectorText()) + " should not be " + attr));
        return state;
      });
      return this;
    };
    $.fn.shouldSay = function(text, msg) {
      equal(this.text(), text, msg || ("" + text + " is displayed within " + (this.selectorText())));
      return this;
    };
    $.fn.shouldEqual = function($el) {
      ok($(this).length === 1 && $el.length === 1, 'checking for element duplication');
      equal($(this)[0], $el[0], "" + ($(this).selectorText()) + " is equal to " + ($el.selectorText()));
      return this;
    };
    $.fn.pressKey = function(k, msg) {
      var $e;

      if (msg) {
        ok(true, "I press " + msg);
      }
      $e = $.Event('keydown');
      $e.keyCode = $e.which = k;
      return $(this).trigger($e);
    };
    tester = {
      data: function() {
        return this.$trigger.data('windoze');
      },
      verifyHidden: function() {
        this.data().$modal.shouldBe(':hidden');
        return this.data().$overlay.shouldBe(':hidden');
      },
      verifyVisible: function() {
        this.data().$modal.shouldBe(':visible');
        return this.data().$overlay.shouldBe(':visible');
      },
      createElements: function(text) {
        text || (text = 'some text');
        return $(document.body).append($('<div />').attr('class', 'wdz-modal').text(text)).append($('<div />').attr('class', 'wdz-overlay'));
      },
      reset: function() {
        $('body > *').not("[id^='qunit-']").remove();
        return this.$fixture = false;
      },
      use: function(selector) {
        this.$fixture = $(selector);
        return this.$fixture.siblings().remove();
      },
      init: function(opts, $el) {
        if (!this.$fixture) {
          this.use('.link_trigger');
        }
        this.$trigger = $el || this.$fixture.find('a').eq(0);
        return this.$trigger.windoze(opts);
      }
    };
    QUnit.testDone($.proxy(tester.reset, tester));
    module('Element Creation');
    test('it chains properly', function() {
      var $trigger;

      $trigger = tester.init();
      return deepEqual($trigger.hide().show(), $trigger, 'returns trigger properly');
    });
    test('it uses .wdz-modal and .wdz-overlay if present', function() {
      var $trigger;

      tester.createElements();
      $trigger = tester.init();
      return tester.data().$modal.shouldEqual($('.wdz-modal')).shouldSay('some text');
    });
    test('it creates a default .wdz-modal and .wdz-overlay if not present', function() {
      var $trigger;

      $trigger = tester.init();
      tester.data().$modal.shouldEqual($('.wdz-modal')).shouldSay('');
      return tester.data().$overlay.shouldEqual($('.wdz-overlay'));
    });
    test('any created .wdz-modal has a unique id', function() {
      var $trigger;

      $trigger = tester.init();
      return ok(tester.data().$modal.attr('id').match(/\bwdz-\d{4}\b/), 'modal has an id of wdz-[4 digits]');
    });
    test('it uses a particular element if one is specified', function() {
      var $trigger;

      $(document.body).append($('<div />').addClass('wdz-modal').attr('id', 'other_modal').text('foo'));
      $trigger = tester.init({
        container: '#other_modal'
      });
      return tester.data().$modal.shouldEqual($('.wdz-modal#other_modal')).shouldSay('foo');
    });
    test('it creates a particular element if one is specified and does not exist', function() {
      var $trigger;

      $trigger = tester.init({
        container: '#other_modal.some_class'
      });
      return tester.data().$modal.shouldEqual($('#other_modal.some_class')).shouldSay('');
    });
    module('Triggering');
    test('clicking an anchor with an href of `#` opens non-ajax modal', function() {
      var $trigger;

      tester.createElements();
      $trigger = tester.init();
      tester.verifyHidden();
      $trigger.click();
      tester.verifyVisible();
      tester.data().$modal.shouldEqual($('.wdz-modal')).shouldSay('some text');
      return $(document.body).shouldBe('.wdz-modal-open');
    });
    test('passing `open` should open modal', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.windoze('open');
      return tester.verifyVisible();
    });
    test('clicking on the overlay or the base modal container closes the modal', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.click();
      tester.verifyVisible();
      ok(true, 'clicking on element in modal should not close modal');
      tester.data().$modal.children().eq(0).click();
      tester.verifyVisible();
      ok(true, 'clicking on base modal element should close modal');
      tester.data().$modal.click();
      tester.verifyHidden();
      ok(true, 'clicking on overlay should close modal');
      $trigger.click();
      tester.verifyVisible();
      tester.data().$overlay.click();
      tester.verifyHidden();
      return $(document.body).shouldNotBe('.wdz-modal-open');
    });
    test('clicking on any anchor inside modal with [data-wdz-close] closes the modal', function() {
      var $trigger;

      tester.createElements();
      $('.wdz-modal').append("<a href='#' data-wdz-close>close</a>");
      $('body').append("<a href='#' data-wdz-close>close</a>");
      $trigger = tester.init();
      $trigger.click();
      tester.verifyVisible();
      $('body > a').click();
      tester.verifyVisible();
      $('.wdz-modal a').click();
      return tester.verifyHidden();
    });
    test('typing `esc` should close modal', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.click();
      $(document).pressKey(27, 'escape');
      return tester.verifyHidden();
    });
    test('passing `close` should close modal', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.click();
      $trigger.windoze('close');
      return tester.verifyHidden();
    });
    test('calling windoze() with a selector delegates to children', function() {
      var $trigger;

      tester.use('.delegated_trigger');
      $trigger = tester.init({
        delegate: 'a.trigger'
      }, $('.delegated_trigger'));
      $trigger.click();
      $trigger.find('a.one').click();
      tester.verifyHidden();
      $trigger.find('a.two.trigger').click();
      tester.verifyVisible();
      $trigger.windoze('close');
      tester.verifyHidden();
      $trigger.append($("<a href='#' class='three trigger'></a>"));
      $trigger.find('a.three.trigger').click();
      return tester.verifyVisible();
    });
    test('relocate existing wdz-modal element to end of body on initialization', function() {
      tester.use('.relocate_modal');
      tester.init();
      tester.data('windoze').$modal.shouldSay($('#relocate_me').text());
      return $(document.body).children().eq(-1).shouldBe("#relocate_me");
    });
    test('opening a second modal maintains shared overlay', function() {
      tester.createElements();
      $('.wdz-modal').append($("<a class='trigger2' href='#'>trigger 2</a>"));
      $('a.trigger2').windoze({
        container: '.two'
      });
      tester.init().click();
      $('.wdz-modal a').click();
      $('.wdz-overlay, .wdz-modal.two').shouldBe(':visible');
      return $('.wdz-modal').not('.two').shouldNotBe(':visible');
    });
    module('Form Elements', {
      setup: function() {
        tester.createElements();
        return $('.wdz-modal').append($('<input />').attr('type', 'text'));
      }
    });
    test('the first input/textarea should be focused when modal is shown', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.click();
      tester.data().$modal.find('input').shouldBe(':absfocus');
      tester.data().$overlay.click();
      tester.data().$modal.prepend($('<textarea />'));
      $trigger.click();
      tester.data().$modal.find('textarea').shouldBe(':absfocus');
      return tester.data().$modal.text('foobar');
    });
    test('typing `esc` when input is focused should not close modal', function() {
      var $trigger;

      $trigger = tester.init();
      $trigger.click();
      $(document).pressKey(27, 'escape');
      tester.verifyVisible();
      tester.data().$modal.find('input').trigger('blur');
      $(document).pressKey(27, 'escape');
      return tester.verifyHidden();
    });
    module('Remote load');
    asyncTest('calling windoze() on a link with an href loads a remote file', function() {
      var $trigger;

      tester.use('.remote_load');
      $trigger = tester.init({
        afterLoad: function() {
          start();
          return equal($.trim(tester.data().$modal.text()), "I'm a cool remote modal!", 'modal loaded successfully');
        }
      });
      $trigger.click();
      return tester.verifyVisible();
    });
    asyncTest('calling windoze() on a link with an href to an image loads that image into an article', function() {
      var $trigger;

      tester.use('.remote_image');
      $trigger = tester.init({
        afterLoad: function() {
          return start();
        }
      });
      $trigger.click();
      equal(tester.data().$modal.find('article').length, 1, 'article is appended to modal');
      return equal(tester.data().$modal.find('article img').length, 1, 'image is appended to article');
    });
    asyncTest('calling windoze() on a delegated link loads a remote file', function() {
      var $trigger;

      tester.use('.remote_load');
      $trigger = tester.init({
        delegate: 'a',
        afterLoad: function(e) {
          start();
          $(e.target).shouldBe('a');
          return equal($.trim(tester.data().$modal.text()), "I'm a cool remote modal!", 'modal loaded successfully');
        }
      }, $('.remote_load'));
      $trigger.find('a').click();
      return tester.verifyVisible();
    });
    module('Animation');
    test('assign different animation class', function() {
      tester.init({
        animation: 'pop-down'
      }).click();
      return tester.data().$modal.shouldBe('.wdz-animate-pop-down');
    });
    test('detect animation duration from css', function() {
      tester.createElements();
      $('.wdz-modal').css('transition-duration', '2s');
      $('.wdz-overlay').css('transition-duration', '1500ms');
      tester.init();
      equal(tester.data().modal_duration, '2000', 'duration detected successfully');
      return equal(tester.data().overlay_duration, '1500', 'duration detected successfully');
    });
    module('Alternate calling');
    test('allow modal to be initialized on itself', function() {
      tester.use('.init_on_self');
      tester.init({}, $('.init_on_self .wdz-modal'));
      tester.verifyHidden();
      tester.$trigger.windoze('open');
      return tester.verifyVisible();
    });
    module('Events & Methods');
    test('show via open.windoze and close.windoze events on element & modal', function() {
      tester.init();
      tester.data().$el.trigger('open.windoze');
      tester.verifyVisible();
      tester.data().$modal.trigger('close.windoze');
      return tester.verifyHidden();
    });
    test('destroy', function() {
      var $el;

      $el = tester.init();
      $el.windoze('destroy');
      equal($('.wdz-modal').length, 0, 'modal destroyed');
      return ok(!$el.data('windoze'), 'data removed from element');
    });
    module('Options');
    test('show when initialized', function() {
      tester.init({
        init_shown: true
      });
      return tester.verifyVisible();
    });
    test('disable outside click', function() {
      tester.init({
        allow_outside_click: false
      }).windoze('open');
      tester.verifyVisible();
      tester.data().$modal.click();
      return tester.verifyVisible();
    });
    test('disable esc to close', function() {
      tester.init({
        allow_esc: false
      }).windoze('open');
      tester.verifyVisible();
      $(document).pressKey(27, 'escape');
      return tester.verifyVisible();
    });
    test('disable modal relocation', function() {
      tester.use('.relocate_modal');
      tester.init({
        relocate_modal: false
      }).windoze('open');
      tester.data('windoze').$modal.shouldSay($('#relocate_me').text());
      return $('#relocate_me').parent().shouldBe('.relocate_modal');
    });
    test('disable focus input on show', function() {
      var $trigger;

      $trigger = tester.init({
        focus_on_show: false
      });
      $trigger.click();
      tester.data().$modal.find('input').shouldBe(':absfocus');
      tester.data().$overlay.click();
      tester.data().$modal.prepend($('<textarea />'));
      $trigger.click();
      tester.data().$modal.find('textarea').shouldNotBe(':absfocus');
      return tester.data().$modal.text('foobar');
    });
    return test('data attribute support', function() {
      var wdz;

      $('.link_trigger a').attr('data-wdz-delegate', 'a.bar').attr('data-wdz-init_shown', 'true').attr('data-wdz-container', '#foo').attr('data-wdz-animation', 'pop-down');
      wdz = tester.init().data('windoze');
      equal(wdz.delegate, 'a.bar', 'delegate is set to a.bar');
      equal(wdz.init_shown, true, 'init_shown is set to true');
      equal(wdz.container, '#foo', 'container is set to #foo');
      return equal(wdz.animation, 'pop-down', 'animation is set to pop-down');
    });
  })(jQuery);

}).call(this);
