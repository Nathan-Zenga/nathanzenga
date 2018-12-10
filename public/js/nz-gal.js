$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({
		transition: "fade",
		swipe: "disabled"
	});

	$.get('/get/galleries', function(g, status) {
		var imageSize = 'big';
		var imageCrop = window.innerWidth < 768 ? false : true;
		var id = $(".index-slideshow").attr("id");

		Galleria.run( "#" + id, { imageCrop: imageCrop, flickr:"set:"+g[id].set, flickrOptions: { imageSize: imageSize }, autoplay: 3000 });

		$(".work .thumb")
		.each(function() {
			try {
				var id = this.id;
				Galleria.run( ".work .thumb#"+ id +" .cover-image", { flickr:"search:nz-"+g[id].tag+"-cover", flickrOptions: { max: 1 }, imageCrop: true })
			} catch(err) {
				console.log(err)
			}
		})
		.click(function() {
			var id = this.id;
			Galleria.configure({ swipe: "auto" }).run( "#gallery_view .iframe", { flickr:"set:"+g[id].set, flickrOptions: { imageSize: imageSize } });
		});
	});
});
