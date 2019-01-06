$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		function isDevice (rgx) { return rgx.test(detect.parse(navigator.userAgent).device.type) };
		function swipe () { return isDevice(/Mobile|Tablet/) ? 'auto' : 'disabled' };
		var imageSize = 'big';
		var imageCrop = isDevice(/Mobile|Tablet/) || window.innerWidth < 768 ? false : true;
		var runSlideshow = () => {
			return Galleria.run( "#assorted", {
				imageCrop: (window.innerWidth >= window.innerHeight) || imageCrop,
				flickr: "set:"+g.assorted.set,
				flickrOptions: { imageSize: imageSize },
				autoplay: 3000,
				showImagenav: false,
				showInfo: false,
				thumbnails: false,
				swipe: "disabled"
			})
		};

		runSlideshow();
		window.addEventListener("orientationchange", runSlideshow);

		$(".work .thumb").each(function() {
			try {
				let id = this.id;
				Galleria.run( ".work .thumb#"+ id +" .cover-image", { flickr: "search:nz-"+g[id].tag+"-cover", flickrOptions: { max: 1 }, imageCrop: true, thumbnails: false, showImagenav: false })
			} catch(err) {
				console.log(err)
			}
		});

		$(".work .thumb, #figures_thumbs_modal .thumb-img").click(function() {
			if (this.dataset.target !== "#figures_thumbs_modal") {
				let id = this.id;
				Galleria.run( "#gallery_view .iframe", { flickr: "set:"+g[id].set, flickrOptions: { imageSize: imageSize }, swipe: swipe() });
			} else {
				$("#figures_thumbs_modal .thumb-img").each(function() {
					let id = this.id;
					let settings = {
						flickr: "search:nz-"+g[id].tag+"-cover",
						flickrOptions: { max: 1 },
						imageCrop: true,
						showImagenav: false,
						showInfo: false,
						thumbnails: false
					};
					let pos = { blanqkanvas: "center 20%", witley: "center 15%", kojey: "center 20%", kai: "center 85%" };
					settings.imagePosition = pos[id] ? pos[id] : undefined;
					Galleria.run( "#" + id + " .iframe", settings);
				})
			}
		});
	});
});
