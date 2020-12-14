$(function() {
    window.submitBtnController = function(form, progressMsg) {
        var clicked = $(form).find("#clicked:submit").length ? "#clicked" : "";
        var $submitBtn = this.submitBtn = $(form).find(clicked+":submit").attr("disabled", true);
        var method = this.method = this.submitBtn.is(":button") ? "html" : "val";
        this.originalVal = this.submitBtn[method]();
        var progressVal = this.submitBtn[method](progressMsg || "SUBMITTING")[method]();
        this.interval = setInterval(function() {
            var val = $submitBtn[method](), ellipsis = $submitBtn[method]().includes("...");
            $submitBtn[method](ellipsis ? progressVal : val + ".");
        }, 500);
    };
    submitBtnController.prototype.finish = function() {
        clearInterval(this.interval);
        this.submitBtn[this.method](this.originalVal).attr("disabled", false);
    };

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

    $(window).click(function(e) {
        if (e.pageX > parseInt($("nav.show").css("width"))) $(".menu-icon").click();
    });

    $(".toTop").click(0, smoothScroll);
});