$(function() {
    var keys = { 27: 1 /*esc*/, 37: 1 /*left*/, 39: 1 /*right*/ };

    function smoothScroll(scrollTop) {
        scrollTop = typeof scrollTop.data == "number" ? scrollTop.data : scrollTop;
        $("html, body").stop().animate({ scrollTop }, 700, 'easeInOutExpo');
    }

    function toggleMenuFix() {
        var isBelow = window.pageYOffset >= $("main").offset().top;
        $(".menu").toggleClass("fixed", isBelow);
    };

    function toggleScrollTracker() {
        $(".scroll-tracker").css({
            width: (window.pageYOffset / (document.documentElement.offsetHeight-window.innerHeight) * 100) + "%"
        })
    };

    document.onkeydown = function(e) {
        e = e || window.event;
        if (keys[e.keyCode] && $("#gallery_view.in").length) {
            if (e.preventDefault) e.preventDefault();

            switch(e.keyCode) {
                case 27:
                    $(".close-view").click();
                    break;

                case 37:
                    $("#gallery_view .galleria-image-nav-left").click();
                    break;

                case 39:
                    $("#gallery_view .galleria-image-nav-right").click();
                    break;
            }

            return false;
        }
    }

    $(".menu-icon").click(function() {
        if (!$(".menu :animated").length) {
            $(this).toggleClass("is-active");
            var menuOpen = $(this).hasClass("is-active");
            var menuFixed = $(".menu").hasClass("fixed");
            var posToggle   = () => $(".nav-group").toggleClass("pos-toggle", menuOpen);
            var widthToggle = () => $(".nav-group").toggleClass("width-toggle", menuOpen);
            var navToggle   = () => $("nav").slideToggle(function() { if ($(this).is(":hidden")) $(this).css("display", "") });
            var steps = [ posToggle, widthToggle, navToggle ];
            steps = menuOpen ? steps : steps.reverse();
            steps.forEach((step, i) => { setTimeout(() => step(), menuFixed ? 400 * i : 0) });
        }
    });

    $(".toTop").click(0, smoothScroll);

    $(window).on("load scroll", toggleMenuFix);
    $(window).on("load scroll resize", toggleScrollTracker);

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