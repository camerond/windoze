$(function() {
  $(".popup-link").wz_popup(['Edit', 'Delete']);
  $(".modal-link").wz_modal('modal.html');
  
  $("#wz-btn-edit").live("click", function() {
    $.fn.wz_clear();
  });
  
});