$(function() {
	var keys = {
		27: 1, // esc
		37: 1, // left
		39: 1 // right
	};

	function smoothScroll(scrollTop) {
		scrollTop = scrollTop.data != undefined ? scrollTop.data : scrollTop;
		$("html, body").stop().animate({ scrollTop }, 700, 'easeInOutExpo');
	}

	function toggleClass() {
		$(".menu").toggleClass("fixed", window.pageYOffset >= $(".row.menu").offset().top - 15);
	};

	function toggleScrollTracker() {
		$(".scroll-tracker").css({
			width: (window.pageYOffset / (document.documentElement.offsetHeight-window.innerHeight) * 100) + "%"
		})
	};

	document.onkeydown = function(e) {
		e = e || window.event;
		var shiftKey = e.shiftKey;
		if (keys[e.keyCode] && $("#gallery_view.in").length) {
			if (e.preventDefault) e.preventDefault();

			switch(e.keyCode) {
				case 27:
					$(".close-view").click();
					break;

				case 37:
					$("#gallery_view .galleria-image-nav-left").click();
					break;

				case 39:
					$("#gallery_view .galleria-image-nav-right").click();
					break;
			}

			return false;
		}
	}

	$(".menu-icon").click(function() {
		$(this).toggleClass("is-active");
		var steps = [
			(d) => setTimeout(()=> $(".nav-group").css("width", $(this).hasClass("is-active") ? "100%" : ""), d),
			(d) => setTimeout(()=> $("nav").stop().slideToggle(function() {
				if ($(this).css("display") == "none") $(this).css("display", "")
			}), d)
		];
		var menuOpen = $(this).hasClass("is-active");
		var menuFixed = $(".menu").hasClass("fixed");
		steps[0](!menuOpen && menuFixed ? 400 : 0);
		steps[1](menuOpen && menuFixed ? 400 : 0);
	});

	$(".toTop").click(0, smoothScroll);

	toggleClass();
	toggleScrollTracker();
	$(window).scroll(toggleClass);
	$(window).on("scroll resize", toggleScrollTracker);

	$("#info form").submit(function(e) {
		e.preventDefault();
		var form = this;
		var data = {};

		$(this).serializeArray().forEach(function(field) {
			var name = field.name;
			data[name] = field.value;
		});

		$(this).append("<div class='loader' style='display:none'><div class='spinner'></div></div>").find(".loader").stop().fadeIn();

		$.post("/send/message", data, function(res) {
			$(".loader").stop().fadeOut();
			if (res.includes("sent")) $(form).find(".details").val("");
			alert(res);
		})
	});

	if (document.body.id === "settings") {
		$("#bulk").change(function() {
			let isRequired = !this.value.trim();
			$(this).closest("form").find(".details").not(this).attr("required", isRequired);
		});

		$("form.design-edit-settings select").change(function() {
			var $form = $(this).parents("form");
			var data = {id: this.value};
			$.post("/settings/design/document", data, function(doc) {
				if (!doc) {
					$form.find(".details").val("");
				} else {
					$.each(doc, function(k, v) {
						if (typeof v !== "object") {
							$form.find(".details[name="+ k +"]").val(v);
						} else {
							$.each(v, function(k2, v2) {
								$form.find(".details[name="+ k2 +"]").val(v2);
							})
						}
					})
				}
			});
		})
	}
});