$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		function isDevice (rgx) { return rgx.test(detect.parse(navigator.userAgent).device.type) };
		function swipe () { return isDevice(/Mobile|Tablet/) ? 'auto' : 'disabled' };
		var imageSize = 'big', isLandscape;
		var toToggle = () => {
			if (isLandscape != (window.innerWidth >= window.innerHeight)) {
				isLandscape = (window.innerWidth >= window.innerHeight);
				Galleria.run( "#assorted", {
					imageCrop: isLandscape,
					flickr: "set:"+g.assorted.set,
					flickrOptions: { imageSize: imageSize },
					autoplay: 3000,
					showImagenav: false,
					showInfo: false,
					thumbnails: false,
					swipe: "disabled"
				})
			}

			if (window.innerWidth < 768) {
				$(".thumbs-modal").each(function(){
					let length = $(this).find(".thumb-img").length;
					$(this).find(".thumb-img").css("height", length >= 4 ? "calc(25vh - 20px)" : "calc(" + (100 / length) + "vh - 20px)");
				});
			} else {
				$(".thumbs-modal .thumb-img").css("height", "");
			}
		};

		toToggle(); window.addEventListener("resize", toToggle);

		$(".work .thumb").each(function() {
			try {
				let id = this.id;
				Galleria.run( ".work .thumb#"+ id +" .cover-image", {
					flickr: "search:nz-"+g[id].tag+"-cover",
					flickrOptions: { max: 1 },
					imageCrop: true,
					thumbnails: false,
					showImagenav: false
				})
			} catch(err) {
				console.log(err)
			}
		});

		$(".work .thumb, .thumbs-modal .thumb-img").click(function() {
			if (this.dataset.target === "#gallery_view") {
				let id = this.id;
				Galleria.run( "#gallery_view .iframe", { flickr: "set:"+g[id].set, flickrOptions: { imageSize: imageSize }, swipe: swipe() });
			} else {
				$(this.dataset.target).find(".thumb-img").each(function() {
					let id = this.id;
					let settings = {
						flickr: "search:nz-"+g[id].tag+"-cover",
						flickrOptions: { max: 1, imageSize: imageSize },
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
