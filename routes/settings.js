var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models/models');
var indexShift = (currentDoc, deletion, cb) => {
	models.gallery.find({index: {$gte: currentDoc.index}}).sort({index: 1}).exec((err, docs) => {
		if (err) return err;
		docs.forEach(doc => {
			doc.index += (deletion ? -1 : 1);
			doc.save();
		});
		if (cb) cb();
	})
};

router.get('/---', (req, res) => {
	models.gallery.find().sort({index: 1}).exec((err, galleries) => {
		models.design.find((err, designs) => {
			models.info_text.find((err, info) => {
				res.render('settings', { title: "Settings", pagename: "settings", docs: { galleries, designs, info: info[0] } })
			})
		})
	})
});

router.post('/gallery/save', (req, res) => {
	var obj;

	function complete (obj) {
		let docs = obj.constructor.name != "Array" ? [obj] : obj;
		models.gallery.insertMany(docs, (err, result) => {
			if (err) return res.send(err);
			res.redirect(req.get("referrer"));
		})
	};

	if (req.body.bulk) {
		let bulk = req.body.bulk.split("\n").map(gallery => {
			let e = gallery.split(" -- ");
			return {tag: e[0].trim(), set_id: e[1].trim(), label: e[2].trim(), index: e[3]}
		});
		bulk.forEach(item => indexShift(item, 0));
		complete(bulk);
	} else {
		obj = { tag: req.body.tag, set_id: req.body.set_id, label: req.body.label, index: req.body.index };
		indexShift(obj, 0, () => complete(obj));
	}
});

router.post('/gallery/delete', (req, res) => {
	var all = req.body.gallery_to_delete === "*";
	var query = {_id: req.body.gallery_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));

	if (!all) {
		models.gallery.findOne(query, (err, doc) => {
			indexShift(doc, 1, () => models.gallery.deleteOne(query, cb));
		})
	} else {
		models.gallery.deleteMany({}, cb);
	}
});

router.post('/info-text/save', (req, res) => {
	models.info_text.deleteMany({}, err => {
		var newInfo = new models.info_text({ text: req.body.text });
		newInfo.save(err => err ? res.send(err) : res.redirect(req.get("referrer")));
	});
});

router.post('/design/save', (req, res) => {
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

router.post('/design/delete', (req, res) => {
	var all = req.body.design_to_delete === "*";
	var query = {_id: req.body.design_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));

	if (!all) {
		models.design.findOne(query, (err, doc) => {
			indexShift(doc, 1, () => models.design.deleteOne(query, cb));
		})
	} else {
		models.design.deleteMany({}, cb);
	}
});

module.exports = router;
