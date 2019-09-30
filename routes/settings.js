var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models/models');

router.get('/---', (req, res) => {
	models.gallery.find((err, galleries) => {
		models.design.find((err, designs) => {
			models.info_text.find((err, info) => {
				res.render('settings', { title: "Settings", pagename: "settings", docs: { galleries, designs, info: info[0] } })
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
		obj = bulk.map(gallery => { let e = gallery.split(" -- "); return {key: e[0].trim(), set_id: e[1].trim(), label: e[2].trim()} });
		complete(obj);
	} else {
		obj = { key: req.body.key, set_id: req.body.set_id, label: req.body.label };
		complete(obj);
	}
});

router.post('/delete/gallery/', (req, res) => {
	var query = req.body.gallery_to_delete === "*" ? {} : {_id: req.body.gallery_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));
	models.gallery.deleteMany(query, cb);
});

router.post('/save/info-text/', (req, res) => {
	models.info_text.deleteMany({}, err => {
		var newInfo = new models.info_text({ text: req.body.text });
		newInfo.save(err => err ? res.send(err) : res.redirect(req.get("referrer")));
	});
});

router.post('/save/design/', (req, res) => {
	var newDesign = new models.design({
		d_id: req.body.d_id,
		text: {
			client: req.body.client,
			tools: req.body.tools,
			description: req.body.description
		},
		link: req.body.link
	});
	newDesign.save(err => err ? res.send(err) : res.redirect(req.get("referrer")));
});

router.post('/delete/design/', (req, res) => {
	var query = req.body.design_to_delete === "*" ? {} : {_id: req.body.design_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));
	models.design.deleteMany(query, cb);
});

module.exports = router;
