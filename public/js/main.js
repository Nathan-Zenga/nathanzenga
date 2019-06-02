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

	var smoothScroll = scrollTop => {
		scrollTop = scrollTop.data != undefined ? scrollTop.data : scrollTop;
		$("html, body").stop().animate({ scrollTop: scrollTop }, 700, 'easeInOutExpo');
	}

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
		$(".menu").toggleClass("fixed", window.pageYOffset >= $(".row.menu").offset().top - 15);
	};

	var toggleScrollTracker = function() {
		$(".scroll-tracker").css({
			width: (window.pageYOffset / (document.documentElement.offsetHeight-window.innerHeight) * 100) + "%"
		})
	};

	$(".menu-icon").click(function() {
		$(this).toggleClass("is-active");
		$("nav").stop().slideToggle(function() {
			if ($(this).css("display") == "none") $(this).css("display", "");
		});
	});

	$(".toTop").click(0, smoothScroll);

	document.onkeydown = overrideKeyPress;

	toggleClass();
	toggleScrollTracker();
	$(window).scroll(toggleClass);
	$(window).on("scroll resize", toggleScrollTracker);

	$("#info form").submit(function(e) {
		e.preventDefault();
		var data = {};

		$("form .details").each(function() {
			var name = $(this).attr("name");
			data[name] = this.value;
		});

		$.post("/send/message", data, function(value) {
			alert(value);
		})
	})
});