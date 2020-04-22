Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({ transition: 'fade', showInfo: false, thumbnails: false })
.on("loadfinish", function(e) {
    var target = this._target;
    var i = $(".inner.img").index(target);
    if ($(".loader").length) $(".loader").hide(0).remove();
    if (i != -1 && !e.cached) {
        var expandIcon = "<div class='expand-icon'><i class='fas fa-expand'></i></div>";

        $(target).append(expandIcon).find(".expand-icon").fadeTo(0, 1).delay(2500).fadeOut(function() {
            $(this).removeAttr("style")
        }).end().closest(".img-container").delay(i * 100).fadeTo(500, 1, function() { $(this).removeAttr("style") })
    }
});

var counter = 0;
function imgOrientation(e) {
    var img = e.currentTarget;
    var imgContainer = $(img).closest(".img-container").get(0);
    var i = $(".img-container").index(imgContainer);
    var landscape = img.width > img.height;
    var portrait = img.width < img.height;
    var dir = portrait ? "vertical" : landscape && (i % 2 == 0) ? "horizontal" : "";
    var finalLoad = counter === e.data.imgLength-1;
    $(imgContainer).addClass(dir);
    if( finalLoad && $(".horizontal:last").offset().top > $(".img-container:last").offset().top )
        $(".horizontal:last").removeClass("horizontal");
    counter += 1;

    if ( finalLoad ) $(".inner.img").galleria({ imageCrop: true, showImagenav: false });
}

function loadGalleryView(e) {
    var set = e.data ? e.data.set : null;
    var isSlideshow = this.className.includes("slideshow");
    var i = $(".inner.img").index(this);
    var id = this.id;
    var options = { flickrOptions: { imageSize: isSlideshow ? "original" : "big" } };

    switch(document.body.id) {
        case "photo":
            set = id.split("-")[1];
            options.flickr = "set:" + set;
            break;

        case "design":
            options.flickr = "tags:nz-designs-" + id;
            break;

        default:
            options.flickr = "set:" + set;
            options.flickrOptions.max = $(".inner.img").length;
            options.show = i;
    }

    $("#gallery_view .iframe").galleria(options);
}

if ($(".grid").length && !("grid" in document.body.style)) {
    if ($(".img-container").length) {
        $(".img-container").unwrap(".grid").unwrap(".grid-container").addClass("col-sm-6");
    } else {
        $(".grid, .grid-container").remove();
    }
}
