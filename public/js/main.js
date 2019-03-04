$(function() {
	var randomRGBA = a => {
		a = a || 1;
		var arr = [];

		for (var i = 0; i < 3; i++) {
			arr.push(Math.round(Math.random() * 255));
		}

		arr = "rgba(" + arr.join(",") + "," + a + ")";
		return arr;
	};

	$(".menu-icon").click(function() {
		$(this).toggleClass("is-active");
		$("nav").slideToggle(function() {
			if ($(this).css("display") == "none") $(this).css("display", "");
		});
		return;
	});

	var keys = {
		// 32: 1, // spacebar
		// 33: 1, // pageup
		// 34: 1, // pagedown
		// 35: 1, // end
		// 36: 1, // home
		37: 1, // left
		// 38: 1, // up
		39: 1, // right
		// 40: 1  // down
	};

	// var smoothScroll = (scrollTop) => {
	// 	$("html, body").stop().animate({ scrollTop: scrollTop }, 700, 'easeInOutExpo');
	// }

	// var markSection = () => {
	// 	var $lastVisitedSection;
	// 	$("section").each(function(i){
	// 		if ( window.pageYOffset >= $(this).offset().top ) {
	// 			$lastVisitedSection = $(this);
	// 		}
	// 	});
	// 	return $lastVisitedSection;
	// }

	// var index = markSection().index();

	var overrideKeyPress = function(e) {
		e = e || window.event;
		var shiftKey = e.shiftKey;
		if (keys[e.keyCode]) {
			if (e.preventDefault) e.preventDefault();

			var key = e.keyCode;

			if (key == 37 && $("#gallery_view .galleria-image-nav-left").length) {
				$("#gallery_view .galleria-image-nav-left").click();
			} else if (key == 39 && $("#gallery_view .galleria-image-nav-right").length) {
				$("#gallery_view .galleria-image-nav-right").click();
			}

			return false;
		}
	}

	document.onkeydown = overrideKeyPress;

	// $("input:not(:submit), textarea")
	// 	.focusin(function(){
	// 		document.onkeydown = null;
	// 	})
	// 	.focusout(function(){
	// 		document.onkeydown = overrideKeyPress;
	// 	});

	// // for mouse wheel/touchpad movements
	// $('html, body').on('DOMMouseScroll mousewheel', function(e){
	// 	function main() {
	// 		e = e || window.event;
	// 		if (e.preventDefault) e.preventDefault();

	// 		// scroll down, else scroll up
	// 		e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0 ? index += 1 : index -= 1;

	// 		if (index < 0) index = 0;
	// 		else if ( index > $("section:last").index() ) index = $("section:last").index();

	// 		smoothScroll($("section").eq(index).offset().top);
	// 	}

	// 	$(":animated").length ? this.addEventListener("animationend", main) : main();

	// 	//prevent page from scrolling
	// 	return false;
	// });

	// $("nav .link").click(function() {
	// 	try {
	// 		var s = this.id;
	// 		index = $("section." + s).index();
	// 		smoothScroll($("section." + s).offset().top)
	// 	} catch(err) {
	// 		console.log("Section doesn't exist")
	// 	}
	// 	if (window.innerWidth < 768) $("#navclose").click();
	// });

	// $("#nav_dropdown").click(function() {
	// 	$("nav").slideDown();
	// 	$(this).fadeOut();
	// });

	// $("#navclose").click(function(){
	// 	$("nav").slideUp(function() {
	// 		$("#nav_dropdown").fadeIn().css("display","");
	// 		$(this).css("display","");
	// 	});
	// });

	// $(".contact .submit").click(function(e){
	// 	e.preventDefault();

	// 	$(".contact .result")
	// 	.css("display", "none")
	// 	.html("<p style='text-align:center; margin-top: 20px'>Sending...</p>")
	// 	.fadeIn();

	// 	var $details = $(this).closest("form").find(".details");
	// 	var data = {};

	// 	$details.each(function() {
	// 		var key = $(this).attr('name');
	// 		data[key] = $(this).val();
	// 	});

	// 	$.post('/send/message', data, function(msg, status) {
	// 		if (status !== 'success') {
	// 			alert("error: "+status );
	// 		} else {
	// 			if (msg.includes("sent")) $(".contact form .details").val("");
	// 			$(".contact .result")
	// 				.stop()
	// 				.fadeOut(function() { $(this).html("<h3 style='text-align:center'>"+ msg +"</h3>") })
	// 				.fadeIn().delay(3000).fadeOut();
	// 		}
	// 	});
	// });
});