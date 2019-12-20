$(function() {
	var keys = {
		27: 1, // esc
		37: 1, // left
		39: 1 // right
	};

	function smoothScroll(scrollTop) {
		scrollTop = typeof scrollTop.data == "number" ? scrollTop.data : scrollTop;
		$("html, body").stop().animate({ scrollTop }, 700, 'easeInOutExpo');
	}

	function toggleMenuFix() {
		var isBelow = window.pageYOffset >= $("main").offset().top;
		$(".menu").toggleClass("fixed", isBelow);
	};

	function toggleScrollTracker() {
		$(".scroll-tracker").css({
			width: (window.pageYOffset / (document.documentElement.offsetHeight-window.innerHeight) * 100) + "%"
		})
	};

	document.onkeydown = function(e) {
		e = e || window.event;
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
		if (!$(".menu :animated").length) {
			$(this).toggleClass("is-active");
			var menuOpen = $(this).hasClass("is-active");
			var menuFixed = $(".menu").hasClass("fixed");
			var posToggle   = () => $(".nav-group").toggleClass("pos-toggle", menuOpen);
			var widthToggle = () => $(".nav-group").toggleClass("width-toggle", menuOpen);
			var navToggle   = () => $("nav").slideToggle(function() { if ($(this).is(":hidden")) $(this).css("display", "") });
			var steps = [ posToggle, widthToggle, navToggle ];
			steps = menuOpen ? steps : steps.reverse();
			steps.forEach((step, i) => { setTimeout(() => step(), menuFixed ? 400 * i : 0) });
		}
	});

	$(".toTop").click(0, smoothScroll);

	toggleMenuFix();
	toggleScrollTracker();
	$(window).scroll(toggleMenuFix);
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
			var isRequired = !this.value.trim();
			$(this).closest("form").find(".details").not(this).attr("required", isRequired);
		});

		$.post("/settings/design/documents", function(docs) {
			$("form.design-edit-settings select").change(function() {
				var $form = $(this).parents("form");
				var id = this.value;
				var doc = docs.filter(function(doc) { return doc._id == id })[0];
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