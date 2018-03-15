$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.6/themes/classic/galleria.classic.min.js").configure("transition", "fade");
	var g = {
		abstract: "72157663613653419",
		figures: "72157663122488679",
		vandalism: "72157656087051975",
		ravensbourne: "72157656059298655",
		aplha: "72157652167823921",
		places1: "72157647897931254",
		places2: "72157680342839503",
		fest: "72157647897269204",
		holga: "72157646711213358",
		assorted: "72157647107363402",
		interval: "72157647107024312",
		royal: "72157647058898826",
		solarised: "72157647119896135",
		light: "72157647106866472",
		passive: "72157647058775116",
		incognito: "72157647058547856",
		art: "72157646698234267",
		cyborg: "72157646697855169",
		crest: "72157646698041797",
		designs: "72157646703093220",
		closed: "72157646697568489",
		fauna: "72157647905448693",
		"4svciety": "72157682756177700",
		eddygrant: "72157681869499180",
		beatfreeks: "72157680397025793",
		scanned: "72157663115670011",
		kojey: "gejHlqqRoAM",
		trip: "qWoNMJ0HeaY",
		dede: "dYSLvmaZlh0",
		ab: "KkCTDiIECM8",
		laswap: "jYZiBss_eSU"
	};

	var imageSize = 'big';
	var id = $(".iframe").attr("id");

	if ($('#video-page, #about-page').length == 0) {
		Galleria.run( "#"+id, { flickr:"set:"+g[id], flickrOptions: { imageSize: imageSize } })
	}

	$(".sublist a").click(function() {
		if ($(window).width() < 768) {
			$("#navclose").click();
		}

		var id = $(this).attr("id").slice(0,-1),
			e = '<div class="iframe" oncontextmenu="return false" id="' + id + '"></div>',
			vid = '<iframe class="iframe" src="https://www.youtube.com/embed/' + g[id] + '?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

		if( $("#video-page").length ) {
			$(".main span").html(vid);

		} else {
			$(".main span").html(e);
			Galleria.run( "#"+id, { flickr:"set:"+g[id], flickrOptions: { imageSize: imageSize } });
		}
	});
});