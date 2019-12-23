$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade', showInfo: false, thumbnails: false, showImagenav: false })
	.on("loadfinish", function(e) {
		var target = this._target;
		var $imgContainer = $(target).parents(".img-container");
		if ($(".loader").length) $(".loader").hide(0).remove();
		if (/inner|img/.test(target.className) && !e.cached) {
			$(target).append("<div class='expand-icon'><i class='fas fa-expand'></i></div>").find(".expand-icon").fadeTo(0, 1).delay(2500).fadeOut(function() {
				$(this).removeAttr("style")
			});

			var i = $(".img").index(target);
			$imgContainer.delay(i * 100).fadeTo(500, 1, function() { $(this).removeAttr("style") })
		}
	});

	var imageSize = 'big';
	var pagename = document.body.id;
	var post = $.post('/key');
	var key = post.status != 404 ? post.responseText : undefined;
	var flickr = new Galleria.Flickr(key);
	var counter = 0;

	$(".content.galleria-init").prepend(!$(".inner.img").length ? "<div class='loader'></div>" : undefined);

	flickr.setOptions({ max: Infinity });

	function loadGalleryView(e) {
		var set = e.data ? e.data.set : null;
		var isSlideshow = this.className.includes("slideshow");
		var i = $(".inner.img").index(this);
		var id = this.id;
		var options = {
			flickrOptions: { imageSize: isSlideshow ? "original" : imageSize }
		};

		switch(pagename) {
			case "photo":
				set = id.split("-")[1];
				options.flickr = "set:" + set;
				break;
				
			case "design":
				options.flickr = "tags:nz-designs-" + id;
				break;

			default:
				options.flickr = "set:" + set;
				options.flickrOptions.max = $(".inner.img").length;
				options.show = i;
		}

		$("#gallery_view .iframe").galleria(options);
	}

	function orientation(e) {
		var img = e.currentTarget;
		var imgContainer = $(img).closest(".img-container").get(0);
		var i = $(".img-container").index(imgContainer);
		var landscape = img.width > img.height;
		var portrait = img.width < img.height;
		var dir = portrait ? "vertical" : landscape && (i % 2 == 0) ? "horizontal" : "";
		var finalLoad = counter === e.data.imgLength-1;
		$(imgContainer).addClass(dir);
		if(finalLoad && $(".horizontal:last").offset().top > $(".img-container:last").offset().top)
			$(".horizontal:last").removeClass("horizontal");
		counter += 1;

		if (finalLoad) $(".inner.img").galleria({ imageCrop: true });
	}

	if ($(".grid").length && !("grid" in document.body.style)) {
		if ($(".img-container").length) {
			$(".img-container").unwrap(".grid").unwrap(".grid-container").addClass("col-sm-6");
		} else {
			$(".grid, .grid-container").remove();
		}
	}

	if (!$(".inner.img").length) {
		var set = pagename === "artwork" ? "72157646703093220" : "72157647107363402";
		flickr.set(set, function(data) {
			var imgLength = data.length;
			data.forEach(function(img, i) {
				var selector = ".content.galleria-init" + ( $(".grid").length ? " .grid" : "" );
				var colClassName = !$(".grid").length ? " col-sm-6" : "";
				$(selector).append('<div class="img-container media-container'+ colClassName +'" style="opacity: 0"><div class="inner img" data-toggle="modal" data-target="#gallery_view" oncontextmenu="return false"><img src="'+ img.big +'"></div></div>');
				if (i === data.length-1) $(".content.galleria-init .img").click({set}, loadGalleryView);
			});
			$(".inner.img img").on("load", {imgLength}, orientation);
		});
	} else {
		var imgLength = $(".content.galleria-init .img").length;
		$(".content.galleria-init .img").each(function(i) {
			var img = this;
			var id = img.id.split("-");
			var isSlideshow = this.className.includes("slideshow");

			if (pagename === "photo") {
				flickr.tags("nz-"+ id[0] +"-cover", function(data) {
					if (data.length) $(img).html("<img src="+ data[0].big +">").children().on("load", {imgLength}, orientation);
				});
			}
			else if (pagename === "design") {
				$(this).galleria({
					imageCrop: !isSlideshow,
					flickr: "tags:nz-designs-" + img.id,
					flickrOptions: { imageSize: isSlideshow ? "original" : imageSize, max: isSlideshow ? undefined : 1 },
					show: img.id ? 0 : i,
					autoplay: isSlideshow ? 4500 : undefined,
					transitionSpeed: isSlideshow ? 1000 : undefined,
					swipe: isSlideshow ? "disabled" : undefined
				})
			}
		}).click(loadGalleryView)
	}
});
