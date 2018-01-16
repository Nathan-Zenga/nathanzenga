$(document).ready(function() {

	$("#dropdown").click(function() {
		$(".nav").slideDown();
		$(this).fadeOut();
	});
	$("#navclose").click(function(){
		$(".nav").slideUp(function() {
			$("#dropdown").fadeIn().css("display","");
			$(this).css("display","");
		});
	});
	
	$(".contact").css({"position":"fixed" , "left":"150%"});
	$(".about #contactOpen").click(function() {
		$(".contact").css({"position":"" , "left":""}).fadeTo(400, 1);
	});
	$("#contactClose").click(function() {
		$(".contact").fadeTo(400, 0, function() {
			$(this).css({"position":"fixed" , "left":"150%"});
		});
	});
	$(".sublist:first").css("color","gold");
	$(".sublist").click(function(){
		$(".sublist").css("color","");
		$(this).css("color","gold");
	});

});