var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models/models');

router.get('/---', (req, res) => {
	models.gallery.find((err, galleries) => {
		models.design.find((err, designs) => {
			models.info_text.find((err, info) => {
				res.render('settings', { title: "Settings", pagename: "settings", docs: { galleries, designs, info } })
			})
		})
	})
});

router.post('/save/gallery', (req, res) => {
	var obj;

	function complete (obj) {
		obj = obj.constructor.name != "Array" ? [obj] : obj;
		models.gallery.insertMany(obj, (err, result) => {
			console.log(result);
			if (err) return res.send(err);
			res.redirect(req.get("referrer"));
		})
	};

	if (req.body.bulk) {
		let bulk = req.body.bulk.split("\n");
		obj = bulk.map(gallery => { let e = gallery.split(" -- "); return {key: e[0].trim(), set_ID: e[1].trim(), label: e[2].trim()} });
		complete(obj);
	} else {
		obj = { key: req.body.key, set_ID: req.body.set_ID, label: req.body.label };
		complete(obj);
	}
});

// router.post('/save/:setting', (req, res) => {
// 	switch (req.params.setting) {

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
	var query = req.body.gallery_to_delete === "*" ? {} : {_id: req.body.gallery_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));
	models.gallery.deleteMany(query, cb);
});

module.exports = router;