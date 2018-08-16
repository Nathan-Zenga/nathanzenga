$(function() {
	$("nav .link").click(function() {
		try {
			var s = this.id;
			$("html, body").stop().animate({
				scrollTop: $("section." + s).offset().top
			}, 700, 'easeInOutExpo')
		} catch(err) {
			console.log("Section doesn't exist")
		}
		if (window.innerWidth < 768) $("#navclose").click();
	});

	$("#nav_dropdown").click(function() {
		$("nav").slideDown();
		$(this).fadeOut();
	});

	$("#navclose").click(function(){
		$("nav").slideUp(function() {
			$("#nav_dropdown").fadeIn().css("display","");
			$(this).css("display","");
		});
	});

	$(".contact .submit").click(function(e){
		e.preventDefault();

		$(".contact .result")
		.css("display", "none")
		.html("<p style='text-align:center'>Sending...</p>")
		.slideDown();

		var $details = $(this).closest("form").find(".details");
		var data = {};

		$details.each(function() {
			var key = $(this).attr('name');
			data[key] = $(this).val();
		});

		$.post('/send/message', data, function(msg, status) {
			if (status !== 'success') {
				alert("error: "+status );
			} else {
				$(".contact form")
					.find(".details")
					.val("")
					.end()
					.find(".result")
					.stop()
					.hide(0)
					.html("<h3 style='text-align:center'>"+ msg +"</h3>")
					.slideDown().delay(3000).slideUp();
			}
		});
	});

	$("#toggleThumbnails").click(function() {
		$("#gallery_view .galleria-thumbnails-container").fadeToggle(100);
	});
});