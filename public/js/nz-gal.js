$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		var imageSize = 'big';

		$(".content.grid > .thumb > .inner").each(function(i) {
			var id = this.id;
			var flickr = id ? "search:nz-" + g[id].tag + "-cover" : "set:" + g.assorted.set
			$(this).galleria({
				imageCrop: true,
				flickr: flickr,
				flickrOptions: { imageSize: imageSize },
				showImagenav: false,
				showInfo: false,
				thumbnails: false,
				swipe: "disabled",
				show: id ? 0 : i,
				max: 1
			})
		}).click(function() {
			var i = $(".content.grid > .thumb > .inner").index(this);
			$("#gallery_view .iframe").galleria({
				flickr: "set:" + g.assorted.set,
				flickrOptions: { imageSize: imageSize },
				showInfo: false,
				thumbnails: false,
				show: i,
				max: 1
			})
		})
	});
});
