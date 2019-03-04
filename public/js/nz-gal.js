$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade' });
	$.get('/get/galleries', function(g, status) {
		function isDevice (rgx) { return rgx.test(detect.parse(navigator.userAgent).device.type) };
		function swipe () { return isDevice(/Mobile|Tablet/) ? 'auto' : 'disabled' };
		var imageSize = 'big'/*, isLandscape*/;
		// var toToggle = () => {
		// 	if (isLandscape != (window.innerWidth >= window.innerHeight)) {
		// 		isLandscape = (window.innerWidth >= window.innerHeight);
		// 		Galleria.run( "#assorted", {
		// 			imageCrop: isLandscape,
		// 			flickr: "set:"+g.assorted.set,
		// 			flickrOptions: { imageSize: imageSize },
		// 			autoplay: 3000,
		// 			showImagenav: false,
		// 			showInfo: false,
		// 			thumbnails: false,
		// 			swipe: "disabled"
		// 		})
		// 	}

		// 	if (window.innerWidth < 768) {
		// 		$(".thumbs-modal").each(function(){
		// 			let length = $(this).find(".thumb-img").length;
		// 			$(this).find(".thumb-img").css("height", length >= 4 ? "calc(25vh - 20px)" : "calc(" + (100 / length) + "vh - 20px)");
		// 		});
		// 	} else {
		// 		$(".thumbs-modal .thumb-img").css("height", "");
		// 	}
		// };

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
		})


	});
});
