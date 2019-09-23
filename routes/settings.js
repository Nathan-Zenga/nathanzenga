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

router.post('/save/:setting', (req, res) => {
	switch (req.params.setting) {

		case "gallery":
			var newGallery = new models.gallery({
				gallery: req.body.gallery,
				label: req.body.label
			});
			newGallery.save(err => { if (err) return res.send(err) })
			break;


		case "designs":
			var newDesign = new models.design({
				id: req.body.id,
				text: {
					client: req.body.client,
					tools: req.body.tools,
					description: req.body.description
				},
				link: req.body.link
			});
			newDesign.save(err => { if (err) return res.send(err) })
			break;


		case "info-text":
			var newInfo = new models.design({
				info: req.body.info
			});
			newInfo.save(err => { if (err) return res.send(err) })
			break;
	}
	res.redirect(req.get("referrer"));
});

router.post('/delete/:section/:id', (req, res) => {
	models[req.params.section].deleteOne({_id: req.params.id}, err => {
		res.redirect(req.get("referrer"));
	});
});

module.exports = router;