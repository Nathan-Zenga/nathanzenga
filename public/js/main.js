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

$("#menu-icon").click(function() {
    $(this).toggleClass("is-active");
    $("#nav").toggleClass("show", $(this).hasClass("is-active"));
});

$("#nav a").click(function() {
    $("#nav").hasClass("show") && $("#menu-icon").click()
});

$(window).click(function(e) {
    e.pageX > parseInt($("#nav.show").css("width")) && $("#menu-icon").click();
});
