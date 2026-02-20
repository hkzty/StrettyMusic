$('#contacts .submit').on('click', function(e) {
    e.preventDefault();
	history.replaceState(undefined, undefined, "#")
	
    $.ajax({
        type: 'post',
        url: './php/form.php',
        data: $('#contacts').serialize(),
        success: function (result) {
			$('#contacts').html("");
            $('#contacts').append(result);
         }
    });
 });
 
// If contact submission has errors, refresh page with hastag when button clicked to resubmit.
// When page refreshed, remove the hastag from the address.
$(window).on('hashchange',function(e){ 
    window.location.reload(true); 
	history.replaceState ("", document.title, e.originalEvent.oldURL);
});
