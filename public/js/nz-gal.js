$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		var imageSize = 'big';
		var isSlideshow;

		$(".content.galleria-init .img").each(function(i) {
			var id = this.id;
			var flickr;
			isSlideshow = this.className.includes("slideshow");

			if (document.body.id === "home")          flickr = "set:" + g.assorted.set;
			else if (document.body.id === "photo")    flickr = "tags:nz-" + g[id].tag + "-cover";
			else if (document.body.id === "design")   flickr = "tags:nz-designs-" + id;

			$(this).galleria({
				imageCrop: isSlideshow ? false : true,
				flickr: flickr,
				flickrOptions: { imageSize: isSlideshow ? "original" : imageSize },
				showImagenav: false,
				showInfo: false,
				thumbnails: false,
				show: id ? 0 : i,
				max: isSlideshow ? undefined : 1,
				autoplay: isSlideshow ? 4000 : undefined,
				swipe: isSlideshow ? "disabled" : undefined
			})

		}).click(function() {
			var i = $(".content.galleria-init .img").index(this);
			var id = this.id;
			var options = {
				flickrOptions: { imageSize: isSlideshow ? "original" : imageSize },
				showInfo: false,
				thumbnails: false,
				swipe: "disabled"
			};

			if (document.body.id == "home") {
				options.flickr = "set:" + g.assorted.set;
				options.show = i;
			} else if (document.body.id == "photo") {
				options.flickr = "set:" + g[id].set;
			} else if (document.body.id == "design") {
				options.flickr = "tags:nz-designs-" + id;
			}

			$("#gallery_view .iframe").galleria(options);
		})
	});
});
