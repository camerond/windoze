$(function() {
  
  $("#popup-link").live("click", function() {
    $(this).wz_popup(['button', 'button2']);
  });
  $("#modal-link").live("click", function() {
    $(this).wz_modal('modal.html');
  });
  
});