$(document).ready(function() {
	document.body.innerHTML = '<div class="bgvid"><video autoplay loop muted poster="/img/bgvid-poster.jpg"> <source src="/img/sparks.mp4"/> </video></div>' + document.body.innerHTML;

	// if ($(".introscreen").css("display") != "none") {
	// 	if(location.hash == "" && location.origin != document.referrer.slice(0, 22)) {
	// 		$(".introscreen").delay( 5000 ).fadeOut( 1000, function() {
	// 			location.hash = "#home";
	// 		});
	// 		$(".introscreen p:last-child").delay( 500 ).fadeIn( 500 );
	// 	} else {
	// 		$(".introscreen").hide(0, function() {
	// 			location.hash = "#home";
	// 		});
	// 	}
	// }

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