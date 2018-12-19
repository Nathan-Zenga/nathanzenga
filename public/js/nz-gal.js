$(function() {
	$.get('/get/galleries', function(g, status) {
		function isDevice (rgx) { return rgx.test(detect.parse(navigator.userAgent).device.type) };
		function swipe () { return isDevice(/Mobile|Tablet/) ? 'auto' : 'disabled' };
		var imageSize = 'big';
		var imageCrop = isDevice(/Mobile|Tablet/) || window.innerWidth < 768 ? false : true;

		Galleria
		.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js")
		.configure({ transition: 'fade' })
		.run( "#assorted", { imageCrop: imageCrop, flickr:"set:"+g.assorted.set, flickrOptions: { imageSize: imageSize }, autoplay: 3000, swipe: "disabled" });

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
			Galleria.run( "#gallery_view .iframe", { flickr:"set:"+g[id].set, flickrOptions: { imageSize: imageSize }, swipe: swipe() });
		});
	});
});
