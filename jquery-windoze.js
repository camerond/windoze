(function($) {

  var methods = {
    wz_popup : function(names) {

      windoze.clear();

      var $target = $(this);
      var $p = windoze.createAndAppend("div", "wz-popup", $("body"));

      makeButtons(names);
      relocatePopup($target);
      associatePopup($target);

      windoze.setData($p, $target);

      return $p;

      function makeButtons(names) {
        $.each(names, function(k, v) {
          var safeName = v.replace(/\s/ig, "-").toLowerCase();
          var closeId = "wz-" + safeName + "-btn";
          windoze.createAndAppend("a", closeId, $p).attr('href', '#').addClass('btn').text(v);
        });
      }

      function relocatePopup($target) {
        var coords = $target.offset();
        $p.css('left', coords['left'] - (($p.outerWidth() - $target.outerWidth()) / 2));
        $p.css('top', coords['top'] - $p.height());
        $p.fadeIn(150, function() { windoze.outsideClickHandler($p) });
      }

      function associatePopup($target) {
        $p.data('target-id', $target.attr('id'));
      }

    },
    wz_modal : function(url) {

      windoze.clear();
      var $modal = windoze.createAndAppend("div", "wz-modal", $("body"));
      var $flood = windoze.createAndAppend("div", "wz-flood", $("#wz-modal"));
      var $content = windoze.createAndAppend("div", "wz-window", $("#wz-modal")).load(url);

      $("#wz-close, #wz-flood").live("click", close);
      captureEscape(close);

      windoze.setData($modal, $(this));

      return $modal;

      function close() {
        $modal.fadeOut(200);
      }

      function captureEscape(callback) {
        $(document).bind("keyup", function(e) {
          if (e.keyCode === 27 && $modal.is(":visible")) {
            callback();
            $(document).unbind(e);
          }
        });
      }

    }
  }

  var windoze = {

    clear : function () {
      $('div[id^="wz-"]').remove();
    },

    createAndAppend : function(tag, id, $target) {
      var $element = $('<' + tag + ' />').attr("id", id);
      $element.appendTo($target);
      return $element;
    },

    outsideClickHandler : function($p) {

      var prefix = 'wz-';
      $("body").bind("click", function(e) {
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

  $.each(methods, function(i) {
    $.fn[i] = this;
  });

})(jQuery);
