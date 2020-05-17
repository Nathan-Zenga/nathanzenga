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
    var opts = {};

    switch(document.body.id) {
        case "artwork":
            opts.show = $(".inner.img").index(this);
            break;
    }

    $.post("/p", {photo_set: this.id}, function(d) {
        $("#gallery_view .iframe").html(d.map(function(e) { return "<img src="+ e.photo_url +">" })).galleria(opts);
    })
}

if ($(".grid").length && !("grid" in document.body.style)) {
    if ($(".img-container").length) {
        $(".img-container").unwrap(".grid").unwrap(".grid-container").addClass("col-sm-6");
    } else {
        $(".grid, .grid-container").remove();
    }
}
