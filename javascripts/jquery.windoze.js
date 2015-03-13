(function() {
  var windoze;

  windoze = {
    name: 'windoze',
    container: '',
    delegate: false,
    init_shown: false,
    relocate_modal: true,
    allow_outside_click: true,
    allow_esc: true,
    lightbox: false,
    focus_on_show: true,
    open: function() {
      return $(this).trigger('open.windoze');
    },
    close: function() {
      return $(this).trigger('close.windoze');
    },
    destroy: function() {
      return $(this).trigger('destroy.windoze');
    },
    readDataAttributes: function() {
      var $el, a, attr, attrs, detected_attrs, i, _i, _j, _len, _len1, _results;

      $el = this.$el;
      attrs = ['container', 'delegate', 'focus_on_show', 'init_shown', 'lightbox', 'relocate_modal', 'animation'];
      detected_attrs = [];
      for (_i = 0, _len = attrs.length; _i < _len; _i++) {
        a = attrs[_i];
        detected_attrs.push($el.attr("data-wdz-" + a));
      }
      _results = [];
      for (i = _j = 0, _len1 = detected_attrs.length; _j < _len1; i = ++_j) {
        attr = detected_attrs[i];
        if (attr) {
          _results.push(this[attrs[i]] = (function() {
            switch (false) {
              case attr !== 'true':
                return true;
              case attr !== 'false':
                return false;
              default:
                return attr;
            }
          })());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    fireCallback: function(name, event) {
      return this[name] && $.proxy(this[name], this)(this.current_event);
    },
    createModalOverlay: function() {
      this.$overlay = $('.wdz-overlay');
      if (!this.$overlay.length) {
        this.$overlay = $('<div />').addClass('wdz-overlay').appendTo($(document.body));
      }
      return this.overlay_duration = this.detectTransitionDuration(this.$overlay);
    },
    createModalWindow: function() {
      var id, klass;

      this.$modal = $(".wdz-modal" + this.container).eq(0);
      if (this.$modal.length) {
        this.relocate_modal && this.$modal.detach().appendTo($(document.body));
      } else {
        id = this.container.match(/#([a-z0-9\-_]+)/gi);
        klass = this.container.match(/\.([a-z0-9\-_]+)/gi);
        this.$modal = $('<div />').attr('id', id ? id.join().replace('#', '') : this.generateID()).addClass('wdz-modal').addClass(klass ? klass.join(' ').replace(/\./g, '') : void 0).appendTo($(document.body));
      }
      this.modal_duration = this.detectTransitionDuration(this.$modal);
      return this.$modal.data('windoze', this);
    },
    changeTransitionType: function() {
      this.$modal.attr('class', function(i, c) {
        return c.replace(/\bwdz-animate\-\S+/g, '');
      });
      if (this.animation) {
        return this.$modal.addClass("wdz-animate-" + this.animation);
      }
    },
    detectTransitionDuration: function($el) {
      var d, duration;

      d = $el.css('transition-duration');
      if (d) {
        duration = +d.split(' ')[0].replace(/([^0-9\.]+)/, '');
      }
      if (duration) {
        return duration * 1000;
      } else {
        return false;
      }
    },
    generateID: function() {
      return "wdz-" + (('' + Math.random()).slice(2, 6));
    },
    forceReflow: function() {
      this.$modal[0].offsetWidth;
      return this.$overlay[0].offsetWidth;
    },
    showAll: function(e) {
      if (this.$modal.is(':visible')) {
        return;
      }
      e.preventDefault();
      this.current_event = e;
      this.$modal.data('windoze', this.$el.data('windoze'));
      this.fireCallback('beforeShow');
      $(document.body).addClass('wdz-modal-open');
      this.hideOtherModals();
      this.changeTransitionType();
      this.$modal.add(this.$overlay).show();
      this.forceReflow();
      this.$modal.add(this.$overlay).addClass('wdz-active');
      if (this.modal_duration) {
        setTimeout($.proxy(this.showModal, this), this.modal_duration);
      } else {
        this.showModal();
      }
      e && this.loadFromEvent(e);
      return false;
    },
    hideAll: function(e) {
      if (!this.$modal.is(':visible')) {
        return;
      }
      e.preventDefault();
      this.current_event = e;
      this.fireCallback('beforeClose');
      this.$modal.removeClass('wdz-active');
      if (this.modal_duration) {
        setTimeout($.proxy(this.hideModal, this), this.modal_duration);
      } else {
        this.hideModal();
      }
      if (!this.keep_overlay) {
        this.$overlay.removeClass('wdz-active');
        if (this.overlay_duration) {
          setTimeout($.proxy(this.hideOverlay, this), this.overlay_duration);
        } else {
          this.hideOverlay();
        }
      }
      return false;
    },
    hideOtherModals: function() {
      return $('.wdz-active').not(this.$modal).not(this.$overlay).each(function() {
        var other_wdz;

        other_wdz = $(this).data('windoze');
        if (other_wdz) {
          other_wdz.keep_overlay = other_wdz.$overlay.is(':visible');
          $(this).trigger('close.windoze');
          return other_wdz.keep_overlay = false;
        }
      });
    },
    showModal: function(e) {
      this.fireCallback('afterShow');
      this.focus_on_show && this.$modal.find(':input').eq(0).focus();
      return this.bindModalEvents();
    },
    hideModal: function(e) {
      this.$modal.hide();
      this.fireCallback('afterClose');
      return this.unbindModalEvents();
    },
    hideOverlay: function() {
      this.$overlay.hide();
      return $(document.body).removeClass('wdz-modal-open');
    },
    loadFromEvent: function(e) {
      var href;

      href = $(e.target).attr('href') || $(e.target).closest('a').attr('href');
      if (!href || href === '#') {
        return;
      }
      this.$modal.addClass('wdz-loading');
      this.fireCallback('beforeLoad');
      if (href.match(/\.(gif|jpg|jpeg|png)$/) || this.lightbox) {
        return this.loadImage(href, e);
      } else {
        return this.loadRemote(href, e);
      }
    },
    loadImage: function(href) {
      var $img;

      $img = $('<img />', {
        src: href
      }).on("load", $.proxy(function() {
        this.$modal.removeClass('wdz-loading');
        return this.fireCallback('afterLoad');
      }, this));
      return this.$modal.empty().append($('<article />').append($img));
    },
    loadRemote: function(href) {
      return this.$modal.load(href, $.proxy(function() {
        this.$modal.removeClass('wdz-loading');
        return this.fireCallback('afterLoad');
      }, this));
    },
    keydownHandler: function(e) {
      if (e.which === 27) {
        if (!this.$modal.find(':focus').length) {
          return this.$modal.trigger('close.windoze');
        }
      }
    },
    outsideClickHandler: function(e) {
      var $t;

      $t = $(e.target);
      if ($t.is(this.$overlay) || $t.is(this.$modal)) {
        e.stopPropagation();
        return this.$el.trigger('close.windoze');
      }
    },
    bindModalEvents: function() {
      this.$modal.on('click.windoze', 'a[data-wdz-close]', function() {
        return $(this).trigger('close.windoze');
      });
      if (this.allow_outside_click) {
        this.$overlay.add(this.$modal).on('click.windoze', $.proxy(this.outsideClickHandler, this));
      }
      if (this.allow_esc) {
        return $(document).off('keydown.windoze').on('keydown.windoze', $.proxy(this.keydownHandler, this));
      }
    },
    unbindModalEvents: function() {
      this.$modal.add(this.$overlay).off('click.windoze');
      return $(document).off('keydown.windoze');
    },
    teardown: function() {
      this.$modal.add(this.$el).off('.windoze');
      this.$modal.remove();
      return this.$el.removeData('windoze');
    },
    init: function() {
      this.readDataAttributes();
      this.createModalOverlay();
      this.$modal = this.$el.is('.wdz-modal') ? this.$el : this.createModalWindow();
      this.$modal.add(this.$el).off('.windoze').on('open.windoze', $.proxy(this.showAll, this)).on('close.windoze', $.proxy(this.hideAll, this)).on('destroy.windoze', $.proxy(this.teardown, this));
      if (!this.$el.is('.wdz-modal')) {
        this.$el.on('click.windoze', this.delegate, $.proxy(this.showAll, this));
      }
      !this.init_shown && this.$el.trigger('close.windoze');
      return this.$el;
    }
  };

  $.fn[windoze.name] = function(opts) {
    var $els, method;

    $els = this;
    method = $.isPlainObject(opts) || !opts ? '' : opts;
    if (method && windoze[method]) {
      windoze[method].apply($els, Array.prototype.slice.call(arguments, 1));
    } else if (!method) {
      $els.each(function() {
        var plugin_instance;

        plugin_instance = $.extend(true, {
          $el: $(this)
        }, windoze, $(this).data('windoze'), opts);
        $(this).data(windoze.name, plugin_instance);
        return plugin_instance.init();
      });
    } else {
      $.error("Method " + method + " does not exist on jQuery. " + windoze.name);
    }
    return $els;
  };

}).call(this);
