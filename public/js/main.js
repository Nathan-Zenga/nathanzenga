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

	var keys = {
		37: 1, // left
		39: 1 // right
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

	var toggleClass = function() {
		$(".menu").toggleClass("fixed", window.pageYOffset >= $(".row.menu").offset().top - 20);
	};

	$(".menu-icon").click(function() {
		$(this).toggleClass("is-active");
		$("nav").stop().slideToggle(function() {
			if ($(this).css("display") == "none") $(this).css("display", "");
		});
		return;
	});

	document.onkeydown = overrideKeyPress;
	toggleClass();
	$(window).scroll(toggleClass);

});