$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		var imageSize = 'big';

		$(".content.grid > .thumb > .inner").each(function(i){
			$(this).galleria({
				imageCrop: true,
				flickr: "set:" + g.assorted.set,
				flickrOptions: { imageSize: imageSize },
				showImagenav: false,
				showInfo: false,
				thumbnails: false,
				swipe: "disabled",
				show: i,
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
