$(function() {
	Galleria.loadTheme("https://cdnjs.cloudflare.com/ajax/libs/galleria/1.5.7/themes/classic/galleria.classic.min.js").configure({transition: "fade"});
	var g = {
		abstract: {set: "72157663613653419", t: "abstract"},
		figures: {set: "72157663122488679", t: "figures"},
		vandalism: {set: "72157656087051975", t: "vandalism"},
		ravensbourne: {set: "72157656059298655", t: "ravensbourne"},
		aplha: {set: "72157652167823921", t: "aplha"},
		places1: {set: "72157647897931254", t: "places1"},
		places2: {set: "72157680342839503", t: "places2"},
		fest: {set: "72157647897269204", t: "fest"},
		holga: {set: "72157646711213358", t: "holga"},
		assorted: {set: "72157647107363402", t: "assorted"},
		interval: {set: "72157647107024312", t: "interval"},
		royal: {set: "72157647058898826", t: "royal"},
		solarised: {set: "72157647119896135", t: "solarised"},
		light: {set: "72157647106866472", t: "light"},
		passive: {set: "72157647058775116", t: "passive"},
		incognito: {set: "72157647058547856", t: "incognito"},
		art: {set: "72157646698234267", t: "art"},
		cyborg: {set: "72157646697855169", t: "cyborg"},
		crest: {set: "72157646698041797", t: "crest"},
		designs: {set: "72157646703093220", t: "designs"},
		closed: {set: "72157646697568489", t: "closed"},
		fauna: {set: "72157647905448693", t: "fauna"},
		"4svciety": {set: "72157682756177700", t: "4svciety"},
		eddygrant: {set: "72157681869499180", t: "eddygrant"},
		beatfreeks: {set: "72157680397025793", t: "beatfreeks"},
		scanned: {set: "72157663115670011", t: "scanned"},
		kojey: {set: "gejHlqqRoAM", t: "kojey"},
		trip: {set: "qWoNMJ0HeaY", t: "trip"},
		dede: {set: "dYSLvmaZlh0", t: "dede"},
		ab: {set: "KkCTDiIECM8", t: "ab"},
		laswap: {set: "jYZiBss_eSU", t: "laswap"}
	};

	var imageSize = 'big';
	var imageCrop = window.innerWidth < 768 ? false : true;
	var id = $(".index-slideshow").attr("id");

	if ($(".index-slideshow").length) {
		if (id == 'assorted') {
			Galleria.run( "#"+id, { imageCrop: imageCrop, flickr:"set:"+g[id].set, flickrOptions: { imageSize: imageSize }, autoplay: 3000 })
		} else {
			Galleria.run( "#"+id, { imageCrop: imageCrop, flickr:"set:"+g[id].set, flickrOptions: { imageSize: imageSize }})
		}
	}

	$(".work .thumb").each(function(){
		try {
			var id = this.id;
			Galleria.run( ".work .thumb#"+ id +" .cover-image", { flickr:"search:nz-"+g[id].t+"-cover", flickrOptions: { max: 1 }, imageCrop: true })
		} catch(err) {
			console.log(err)
		}
	});

});