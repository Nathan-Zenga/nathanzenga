$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade', showInfo: false, thumbnails: false });
	$.post('/galleries', function(g, status) {
		var imageSize = 'big';
		var isSlideshow;
		var pagename = document.body.id;
		var flickr = new Galleria.Flickr(g.key);

		flickr.setOptions({ max: Infinity });

		function onclick(e) {
			var isSlideshow = e.data ? e.data.isSlideshow : null;
			var i = $(".content.galleria-init .img").index(this);
			var id = this.id;
			var options = {
				flickrOptions: { imageSize: isSlideshow ? "original" : imageSize }
			};

			if (pagename == "home") {
				options.flickr = "set:" + g.sets.assorted.set;
				options.show = i;
			} else if (pagename == "photo") {
				options.flickr = "set:" + g.sets[id].set;
			} else if (pagename == "design") {
				options.flickr = "tags:nz-designs-" + id;
			}

			$("#gallery_view .iframe").galleria(options);
		}

		if (pagename === "home") {
			flickr.set(g.sets.assorted.set, function(data) {
				data.forEach(function(img, i) {
					$(".content.galleria-init")
					.append('<div class="col-sm-6 col-md-4 img-container"><div class="inner img" data-toggle="modal" data-target="#gallery_view" oncontextmenu="return false"><img src="'+ img.big +'"></div></div>')
					.find(".img").eq(-1)
					.galleria({
						imageCrop: true,
						showImagenav: false
					});
					if (i === data.length-1) $(".content.galleria-init .img").click(onclick);
				})
			});
		} else {
			$(".content.galleria-init .img").each(function(i) {
				var img = this;
				var imgID = img.id;
				isSlideshow = this.className.includes("slideshow");

				if (pagename === "photo") {
					flickr.tags("nz-"+ g.sets[imgID].tag +"-cover", function(data) {
						$(img).html("<img src="+ data[0].big +">").galleria({
							imageCrop: true,
							showImagenav: false
						})
					});
				}
				else if (pagename === "design") {
					$(this).galleria({
						imageCrop: !isSlideshow,
						flickr: "tags:nz-designs-" + imgID,
						flickrOptions: { imageSize: isSlideshow ? "original" : imageSize },
						showImagenav: false,
						show: imgID ? 0 : i,
						max: isSlideshow ? undefined : 1,
						autoplay: isSlideshow ? 4000 : undefined,
						swipe: isSlideshow ? "disabled" : undefined
					})
				}
			}).click(isSlideshow, onclick)
		}
	});
});
