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
	var isSlideshow;

	$(".content.galleria-init").html(pagename === "home" ? "<div class='loader' style='position: relative; top: auto: left: auto;'><div class='spinner'></div></div>" : undefined);

	flickr.setOptions({ max: Infinity });

	function onclick(e) {
		var isSlideshow = e.data ? e.data.isSlideshow : null;
		var i = $(".content.galleria-init .img").index(this);
		var id = this.id;
		var options = {
			flickrOptions: { imageSize: isSlideshow ? "original" : imageSize }
		};

		switch(pagename) {
			case "home":
				options.flickr = "set:72157663613653419";
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

	if (pagename === "home") {
		flickr.set("72157663613653419", function(data) {
			$(".loader").fadeOut(function(){
				$(this).remove();
				data.forEach(function(img, i) {
					$(".content.galleria-init")
					.append('<div class="col-sm-6 col-md-4 img-container"><div class="inner img" style="display: none" data-toggle="modal" data-target="#gallery_view" oncontextmenu="return false"><img style="display: none" src="'+ img.big +'"></div></div>')
					.find(".img").eq(-1).delay(i * 250).slideDown(function() {
						$(this).removeAttr("style").children("img").removeAttr("style").end().galleria({
							imageCrop: true,
							showImagenav: false
						});
					});
					if (i === data.length-1) $(".content.galleria-init .img").click(onclick);
				})
			});
		});
	} else {
		$(".content.galleria-init .img").each(function(i) {
			var img = this;
			var id = img.id.split("-");
			isSlideshow = this.className.includes("slideshow");

			if (pagename === "photo") {
				flickr.tags("nz-"+ id[0] +"-cover", function(data) {
					$(img).html("<img src="+ data[0].big +">").galleria({
						imageCrop: true,
						showImagenav: false
					})
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
					autoplay: isSlideshow ? 4000 : undefined,
					swipe: isSlideshow ? "disabled" : undefined
				})
			}
		}).click(isSlideshow, onclick)
	}
});
