(function() {
  (function($) {
    var windoze;

    windoze = {
      name: 'windoze',
      container: '',
      delegate: false,
      init_shown: false,
      open: function() {
        return $(this).data('windoze').showAll();
      },
      close: function() {
        return $(this).data('windoze').hideAll();
      },
      readDataAttributes: function() {
        var $el, attr, attrs, detected_attrs, i, _i, _len, _results;

        $el = this.$el;
        attrs = ['container', 'delegate', 'init_shown', 'animation'];
        detected_attrs = attrs.map(function(a) {
          return $el.attr("data-wdz-" + a);
        });
        _results = [];
        for (i = _i = 0, _len = detected_attrs.length; _i < _len; i = ++_i) {
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
      fireCallback: function(name) {
        return this[name] && $.proxy(this[name], this)();
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
        if (!this.$modal.length) {
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
        var duration;

        duration = +$el.css('transition-duration').split(' ')[0].replace(/([^0-9\.]+)/, '');
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
        if (e) {
          e.preventDefault();
          return this.loadRemote($(e.target).attr('href'));
        }
      },
      hideAll: function(e) {
        if (!this.$modal.is(':visible')) {
          return;
        }
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
        return e && e.preventDefault();
      },
      hideOtherModals: function() {
        return $('.wdz-active').not(this.$modal).not(this.$overlay).each(function() {
          var other_wdz;

          other_wdz = $(this).data('windoze');
          if (other_wdz) {
            other_wdz.keep_overlay = other_wdz.$overlay.is(':visible');
            return other_wdz.hideAll();
          }
        });
      },
      showModal: function() {
        this.fireCallback('afterShow');
        this.$modal.find(':input').eq(0).focus();
        return this.bindModalEvents();
      },
      hideModal: function() {
        this.$modal.hide();
        $(document.body).removeClass('wdz-modal-open');
        this.fireCallback('afterClose');
        return this.unbindModalEvents();
      },
      hideOverlay: function() {
        return this.$overlay.hide();
      },
      loadRemote: function(href) {
        if (!href || href === '#') {
          return;
        }
        this.$modal.addClass('wdz-loading');
        this.fireCallback('beforeLoad');
        return this.$modal.load(href, $.proxy(function() {
          this.$modal.removeClass('wdz-loading');
          return this.fireCallback('afterLoad');
        }, this));
      },
      keydownHandler: function(e) {
        if (e.which === 27) {
          if (!this.$modal.find(':focus').length) {
            return this.hideAll();
          }
        }
      },
      outsideClickHandler: function(e) {
        var $t;

        $t = $(e.target);
        if ($t.is(this.$overlay) || $t.is(this.$modal)) {
          e.stopPropagation();
          return this.hideAll();
        }
      },
      bindModalEvents: function() {
        this.$overlay.add(this.$modal).on('click.wdz', $.proxy(this.outsideClickHandler, this));
        this.$modal.on('click.wdz', 'a[data-wdz-close]', $.proxy(this.hideAll, this));
        return $(document).off('keydown.wdz').on('keydown.wdz', $.proxy(this.keydownHandler, this));
      },
      unbindModalEvents: function() {
        this.$modal.add(this.$overlay).off('click.wdz');
        return $(document).off('keydown.wdz');
      },
      bindTriggerEvents: function() {
        return this.$el.on('click.wdz', this.delegate, $.proxy(this.showAll, this));
      },
      init: function() {
        this.readDataAttributes();
        this.createModalOverlay();
        this.createModalWindow();
        this.bindTriggerEvents();
        !this.init_shown && this.hideAll();
        return this.$el;
      }
    };
    return $.fn[windoze.name] = function(opts) {
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
          }, windoze, opts);
          $(this).data(windoze.name, plugin_instance);
          return plugin_instance.init();
        });
      } else {
        $.error('Method #{method} does not exist on jQuery. #{windoze.name}');
      }
      return $els;
    };
  })(jQuery);

}).call(this);
