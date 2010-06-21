$(function() {

  $(".popup-link").wz_popup(['Edit', 'Delete']);
  $(".modal-link").wz_modal('modal.html');

  $("#wz-btn-edit").live("click", function() {
    alert("I am associated to " + $("#wz-popup").data('wz_target').attr("class"));
    $.fn.wz_clear();
  });

});
