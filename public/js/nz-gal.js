$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		var imageSize = 'big';

		$(".content.galleria-init > .img-container > .inner").each(function(i) {
			var id = this.id;
			var flickr = id ? "search:nz-" + g[id].tag + "-cover" : "set:" + g.assorted.set
			$(this).galleria({
				imageCrop: true,
				flickr: flickr,
				flickrOptions: { imageSize: imageSize },
				showImagenav: false,
				showInfo: false,
				thumbnails: false,
				show: id ? 0 : i,
				max: 1
			})

		}).click(function() {
			var i = $(".content.grid > .img-container > .inner").index(this);
			var id = this.id;
			var options = {
				flickrOptions: { imageSize: imageSize },
				showInfo: false,
				thumbnails: false,
				swipe: "disabled"
			};

			if (document.body.id == "home") {
				options.flickr = "set:" + g.assorted.set;
				options.show = i;
				options.max = 1;
			} else if (document.body.id == "photo") {
				options.flickr = "set:" + g[id].set;
			}

			$("#gallery_view .iframe").galleria(options);
		})
	});
});
