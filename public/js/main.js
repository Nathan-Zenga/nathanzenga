$(function() {
    var keys = { 27: 1 /*esc*/, 37: 1 /*left*/, 39: 1 /*right*/ };

    function smoothScroll(scrollTop) {
        scrollTop = typeof scrollTop.data == "number" ? scrollTop.data : scrollTop;
        $("html, body").stop().animate({ scrollTop }, 700, 'easeInOutExpo');
    }

    document.onkeydown = function(e) {
        e = e || window.event;
        if (keys[e.keyCode] && $("#gallery_view.in").length) {
            if (e.preventDefault) e.preventDefault();

            switch(e.keyCode) {
                case 27:
                    $(".close-view").click();
                    break;

                case 37:
                    $("#gallery_view .iframe").data("galleria").prev();
                    break;

                case 39:
                    $("#gallery_view .iframe").data("galleria").next();
                    break;
            }

            return false;
        }
    }

    $(".menu-icon").click(function() {
        $(this).toggleClass("is-active");
        $("nav").toggleClass("show");
    });

    $(".toTop").click(0, smoothScroll);

    $("#info form").submit(function(e) {
        e.preventDefault();
        var form = this;
        $(form).append("<div class='loader' style='display:none'><div class='spinner'></div></div>").find(".loader").stop().fadeIn();

        $.post("/send/message", $(this).serializeArray(), function(res) {
            $(".loader").stop().fadeOut();
            if (res.includes("sent")) $(form).find(".details").val("");
            alert(res);
        })
    });
});