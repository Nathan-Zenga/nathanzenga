var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models/models');

router.get('/---', (req, res) => {
	models.gallery.find((err, docs) => {
		let galleries = docs;

		models.design.find((err, docs) => {
			let designs = docs;

			models.info_text.find((err, docs) => {
				let info = docs;
				res.render('settings', { title: "Settings", pagename: "settings", docs: { galleries, designs, info } })
			})
		})
	})
});

router.post('/save/gallery', (req, res) => {
	var obj;

	function complete (obj) {
		obj = obj.constructor.name != "Array" ? [obj] : obj;
		models.gallery.collection.insert(obj, (err, result) => {
			console.log(result);
			if (err) return res.send(err);
			res.redirect(req.get("referrer"));
		})
	};

	if (req.body.bulk) {
		models.gallery.deleteMany({}, err => {
			let bulk = req.body.bulk.split("\n");
			obj = bulk.map(gallery => { let e = gallery.split(" -- "); return {key: e[0], set_ID: e[1], label: e[2]} });
			complete(obj);
		})
	} else {
		obj = { key: req.body.key, set_ID: req.body.set_ID, label: req.body.label };
		complete(obj);
	}
});


// router.post('/save/:setting', (req, res) => {
// 	switch (req.params.setting) {

// 		case "gallery":
// 			var newGallery = new models.gallery({
// 				gallery: req.body.gallery,
// 				label: req.body.label
// 			});
// 			newGallery.save(err => { if (err) return res.send(err) })
// 			break;

// 		case "designs":
// 			var newDesign = new models.design({
// 				id: req.body.id,
// 				text: {
// 					client: req.body.client,
// 					tools: req.body.tools,
// 					description: req.body.description
// 				},
// 				link: req.body.link
// 			});
// 			newDesign.save(err => { if (err) return res.send(err) })
// 			break;

// 		case "info-text":
// 			var newInfo = new models.design({
// 				info: req.body.info
// 			});
// 			newInfo.save(err => { if (err) return res.send(err) })
// 			break;
// 	}
// 	res.redirect(req.get("referrer"));
// });

router.post('/delete/gallery/', (req, res) => {
	models.gallery.deleteOne({_id: req.body.gallery_to_delete}, err => {
		res.redirect(req.get("referrer"));
	});
});

// router.post('/edit/:section/', (req, res) => {
// 	models[req.params.section].findById({_id: req.params.id}, (err, item) => {
// 		for (k in req.body) item[k] = req.body[k];
// 		item.save(err => res.redirect(req.get("referrer")));
// 	});
// });

module.exports = router;