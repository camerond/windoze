(function($) {

  var modal_settings = {
    speed: 150
    //width
    //prefix
  }

  var popup_settings = {
    speed: 150
    //position: "top"
    //prefix
  }

  var wz_public = {
    wz_popup : function(names, options) {
      return this.live("click", function() {
        
        var opts = $.extend(popup_settings, options);
        wz_public.wz_clear();

        var $target = $(this);
        var $p = wz.createAndAppend("div", "wz-popup", $("body"));

        makeButtons(names);
        relocatePopup($target);
        associatePopup($target)
        
        $(window).bind('resize', function() {
          relocatePopup($target);
        });;

        wz.setData($p, $target);

        function makeButtons(names) {
          $.each(names, function(k, v) {
            var safeName = v.replace(/\s/ig, "-").toLowerCase();
            var closeId = "wz-btn-" + safeName;
            wz.createAndAppend("a", closeId, $p).attr('href', '#').addClass('wz-button').text(v);
          });
        }

        function relocatePopup($target) {
          var coords = $target.offset();
          $p.css('left', coords['left'] - (($p.outerWidth() - $target.outerWidth()) / 2));
          $p.css('top', coords['top'] - $p.outerHeight());
          $p.fadeIn(opts.speed, function() { wz.outsideClickHandler($p) });
        }

        function associatePopup($target) {
          $p.data('target-id', $target.attr('id'));
        }
      });
    },
    wz_modal : function(url, options) {
      return this.live("click", function() {
        var opts = $.extend(modal_settings, options);
        wz_public.wz_clear();

        var $modal = wz.createAndAppend("div", "wz-modal", $("body"));
        var $flood = wz.createAndAppend("div", "wz-flood", $("#wz-modal"));
        var $content = wz.createAndAppend("div", "wz-window", $("#wz-modal")).load(url);

        $("#wz-close, #wz-flood").live("click", close);
        captureEscape(close);

        wz.setData($modal, $(this));

        function close() {
          $modal.fadeOut(opts.speed);
        }

        function captureEscape(callback) {
          $(document).bind("keyup", function(e) {
            if (e.keyCode === 27 && $modal.is(":visible")) {
              //callback();
              $(document).unbind(e);
            }
          });
        }
      });
    },
    wz_popup_defaults : function(options) {
      popup_settings = $.extend(popup_settings, options);
      return this;
    },
    wz_modal_defaults : function(options) {
      modal_settings = $.extend(modal_settings, options);
      return this;
    },
    wz_clear : function() {
      $('div[id^="wz-"]').remove();
    }
  }

  var wz = {

    createAndAppend : function(tag, id, $target) {
      var $element = $('<' + tag + ' />').attr("id", id);
      $element.appendTo($target);
      return $element;
    },

    outsideClickHandler : function($p) {

      var prefix = 'wz-';
      $(document).bind("click", function(e) {
        t = $(e.target);
        if((t.attr('id').substring(0, 3) === prefix) || (t.parents().filter(prefix).length)) {
          return;
        }
        $p.remove();
        $("body").unbind(e);
      });

    },

    setData : function($wz, $target) {
      $wz.data("wz_target", $target);
    }

  }

  $.each(wz_public, function(i) {
    $.fn[i] = this;
  });

})(jQuery);
