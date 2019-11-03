$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade', showInfo: false, thumbnails: false })
	.on("loadfinish", function() {
		if (this._target.className === "inner img") {
			$(this._target).append("<div class='expand-icon'><i class='fas fa-expand'></i></div>").find(".expand-icon").fadeTo(0, 1).delay(2000).fadeOut(function() {
				$(this).removeAttr("style")
			});
		}
	});

	var imageSize = 'big';
	var pagename = document.body.id;
	var post = $.post('/key');
	var key = post.status != 404 ? post.responseText : undefined;
	var flickr = new Galleria.Flickr(key);

	$(".content.galleria-init").prepend(pagename === "home" ? "<div class='loader' style='position: relative; top: auto: left: auto;'><div class='spinner'></div></div>" : undefined);

	flickr.setOptions({ max: Infinity });

	function onclick(e) {
		var isSlideshow = this.className.includes("slideshow");
		var i = $(".content.galleria-init .img").index(this);
		var id = this.id;
		var options = {
			flickrOptions: { imageSize: isSlideshow ? "original" : imageSize }
		};

		switch(pagename) {
			case "home":
				options.flickr = "set:72157647107363402";
				options.show = i;
				break;

			case "photo":
				let set = id.split("-")[1];
				options.flickr = "set:" + set;
				break;

			case "design":
				options.flickr = "tags:nz-designs-" + id;
				break;
		}

		$("#gallery_view .iframe").galleria(options);
	}

	function onImageLoad(e) {
		let img = this;
		let i = typeof e.data == "number" ? e.data : e.data.index(img);
		let landscape = img.width > img.height;
		let portrait = img.width < img.height;
		let orientation = portrait ? "vertical" : landscape && (i % 2 == 0) ? "horizontal" : "";

		$(img).parents(".img-container").addClass(orientation).fadeTo(.5, 1, function() { $(this).removeAttr("style") }).children(".inner.img").galleria({
			imageCrop: true,
			showImagenav: false
		});
	}

	if (pagename === "home") {
		flickr.set("72157647107363402", function(data) {
			$(".loader").fadeOut(function(){
				$(this).remove();
				data.forEach(function(img, i) {
					$(".content.galleria-init .grid").append('<div class="img-container media-container" style="opacity: 0"><div class="inner img" data-toggle="modal" data-target="#gallery_view" oncontextmenu="return false"><img src="'+ img.big +'"></div></div>');
					if (i === data.length-1) $(".content.galleria-init .img").click(onclick);
				});
				$(".inner.img img").on("load", $(".inner.img img"), onImageLoad);
			});
		});
	} else {
		$(".content.galleria-init .img").each(function(i) {
			var img = this;
			var id = img.id.split("-");
			var isSlideshow = this.className.includes("slideshow");

			if (pagename === "photo") {
				flickr.tags("nz-"+ id[0] +"-cover", function(data) {
					if (data.length) {
						$(img).html("<img src="+ data[0].big +">").children().on("load", i, onImageLoad);
					}
				});
			}
			else if (pagename === "design") {
				$(this).galleria({
					imageCrop: !isSlideshow,
					flickr: "tags:nz-designs-" + img.id,
					flickrOptions: { imageSize: isSlideshow ? "original" : imageSize },
					showImagenav: false,
					show: img.id ? 0 : i,
					max: isSlideshow ? undefined : 1,
					autoplay: isSlideshow ? 4500 : undefined,
					transitionSpeed: isSlideshow ? 1000 : undefined,
					swipe: isSlideshow ? "disabled" : undefined
				})
			}
		}).click(onclick)
	}
});
