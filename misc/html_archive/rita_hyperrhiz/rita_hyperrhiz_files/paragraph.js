$(document).ready(function() {

	// make a link out of any <sup> with class .paragraph
	$('.paragraph').each(function(i){
		var paranum = i+1;
		$(this).html('<a>[' + paranum + ']</a>');
	});
});