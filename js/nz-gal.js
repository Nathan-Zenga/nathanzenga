$(function(){
    var s;
    function showNames() {
		if ( $("#figures").length && $("#figures, .galleria-info-title").length > 1 && $(".galleria-info-title").text() != "" ) {
			$(".iframe").append("<div id='info-title'></div>");
			$("#info-title").text( $(".galleria-info-title").text().replace(/X|V|I| X| V| I/g,"") );
			$("#info-title").animate({
				left: "+=20"
			}, 3000, "linear");
			$("#info-title").fadeIn().dequeue().delay(2600).fadeOut(function(){$(this).css("left","")});
			clearInterval(s);
		}
	}
    
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.6/themes/classic/galleria.classic.min.js").configure("transition", "fade");
	var g = {"abstract":"72157663613653419",
			"figures":"72157663122488679",
			"vandalism":"72157656087051975",
			"ravensbourne":"72157656059298655",
			"aplha":"72157652167823921",
			"places1":"72157647897931254",
			"places2":"72157680342839503",
			"fest":"72157647897269204",
			"holga":"72157646711213358",
			"assorted":"72157647107363402",
			"interval":"72157647107024312",
			"royal":"72157647058898826",
			"solarised":"72157647119896135",
			"light":"72157647106866472",
			"passive":"72157647058775116",
			"incognito":"72157647058547856",
			"art":"72157646698234267",
			"cyborg":"72157646697855169",
			"crest":"72157646698041797",
			"designs":"72157646703093220",
			"closed":"72157646697568489",
			"fauna":"72157647905448693",
			"4svciety":"72157682756177700",
			"eddygrant":"72157681869499180",
			"beatfreeks":"72157680397025793",
			"scanned": "72157663115670011",
			"motion1": "trailingball",
			"motion2": "ripple",
			"motion3": "swarm",
			"motion4": "imagegrid",
			"kojey":"gejHlqqRoAM",
			"trip":"qWoNMJ0HeaY",
			"dede":"dYSLvmaZlh0",
			"ab":"KkCTDiIECM8",
			"laswap":"jYZiBss_eSU"};

	var id = $(".iframe").attr("id");

	if (!$("#page-video").length) {
		if ($("#page-art").length) {
			Galleria.run( "#"+id, { flickr:"set:"+g[id], flickrOptions: { max: 25 } });
			$(".nav .row a[href='/art']")
			.removeAttr("href")
			.click(function(){
				if ($(window).width() < 768) {
					$("#navclose").click();
				}
				var e = '<div class="iframe" oncontextmenu="return false" id="art"></div>';
				$(".main span").html(e);
				Galleria.run( "#"+id, { flickr:"set:"+g[id], flickrOptions: { max: 25 } });
			});
		} else if ($("#home-page").length) {
			Galleria.run( "#"+id, { flickr:"set:"+g[id], flickrOptions: { max: 33 } });
		} else {
			Galleria.run( "#"+id, { flickr:"set:"+g[id] });
		}
	}

	if ($("#page-motion").length) {
		var motion = '<iframe class="iframe" style="border:none; border-radius:5px; box-shadow: 0 0 10px gold" src="https://nathanzenga.tumblr.com/trailingball"></iframe>';
		$(".main span").html(motion);
	}

	s = setInterval(function() {
        showNames();
    } );

	$(".sublist a").click(function() {
		if ($(window).width() < 768) {
			$("#navclose").click();
		}
		var id = $(this).attr("id").slice(0,-1),
			e = '<div class="iframe" oncontextmenu="return false" id="' + id + '"></div>',
			vid = '<iframe class="iframe" src="https://www.youtube.com/embed/' + g[id] + '?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>',
			motion = '<iframe class="iframe" style="display:none; border:none; border-radius:5px; box-shadow: 0 0 10px gold" src="https://nathanzenga.tumblr.com/' + g[id] + '"></iframe>';

		if( $("#page-video").length ) {
			$(".main span").html(vid);
		} else if( $("#page-motion").length ) {
			$(".main span").html(motion);
			$(".iframe").fadeIn();
		} else {
			$(".main span").html(e);
			Galleria.run( "#"+id, { flickr:"set:"+g[id] });

			if ( $("#figures").length ) {
				$(".iframe").append("<div id='info-title'></div>");
				s = setInterval(function() {
                    showNames();
                } );
			}
		}
	});

	$(".main").click(function() {
		if ( $("#figures").length ) {
			var n = 0;
			clearInterval(s);
			s = setInterval(function() {
				console.log("Interval 3");
				if (n >= 300) {
					n = 0;
					clearInterval(s);
				} else if( $("#info-title").text() != $(".galleria-info-title").text().replace(/X|V|I| X| V| I/g,"") ) {
					$("#info-title").finish().css("left","").hide(0).fadeIn().text( $(".galleria-info-title").text().replace(/X|V|I| X| V| I/g,"") );
					$("#info-title").animate({
						left: "+=20"
					}, 3000, "linear").dequeue();
					$("#info-title").delay(2600).fadeOut(function(){$(this).css("left","")});
					clearInterval(s);
				}
				n+=1;
			});
		}
	});

	var m = setInterval(function() {
		if ( $(".galleria-image-nav-left, .galleria-image-nav-right, .galleria-thumbnails .galleria-image").length ) {
			$(".galleria-image-nav-left, .galleria-image-nav-right, .galleria-thumbnails .galleria-image").click(function(){
				$(".main").click();
			});
			clearInterval(m);
		}
	});

});