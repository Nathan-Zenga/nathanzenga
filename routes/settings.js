var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var models = require('../models/models');
var indexShift = (collection, currentDoc, deletion, cb) => {
	models[collection].find({index: {$gte: currentDoc.index}}).sort({index: 1}).exec((err, docs) => {
		if (err) return res.send(err);
		docs.forEach(doc => {
			doc.index += (deletion ? -1 : 1);
			doc.save();
		});
		if (cb) cb();
	})
};
var indexReorder = (collection, id, newIndex, cb) => {
	models[collection].find().sort({index: 1}).exec((err, docs) => {
		if (err) return res.send(err);
		let selected_doc = docs.filter(e => e._id == id)[0];
		selected_doc.index = newIndex;
		selected_doc.save(err => {
			if (err) return res.send(err);
			docs.forEach((doc, i) => {
				if (doc.index != i) {
					doc.index = i;
					doc.save();
				}
			});
			if (cb) cb();
		});
	})
};

router.get('/---', (req, res) => {
	models.gallery.find().sort({index: 1}).exec((err, galleries) => {
		models.design.find().sort({index: 1}).exec((err, designs) => {
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
		let max_index = parseInt(req.body.max_index);
		let bulk = req.body.bulk.split("\n").map((gallery, i) => {
			let e = gallery.split(" -- ");
			return { tag: e[0].trim(), set_id: e[1].trim(), label: e[2].trim(), index: parseInt(e[3]) > max_index+i ? max_index+i : e[3] }
		});
		bulk.forEach(item => indexShift("gallery", item, 0));
		complete(bulk);
	} else {
		obj = { tag: req.body.tag, set_id: req.body.set_id, label: req.body.label, index: req.body.index };
		indexShift("gallery", obj, 0, () => complete(obj));
	}
});

router.post('/gallery/delete', (req, res) => {
	var all = req.body.gallery_to_delete === "*";
	var query = {_id: req.body.gallery_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));

	if (all) {
		models.gallery.deleteMany({}, cb);
	} else {
		models.gallery.findOne(query, (err, doc) => {
			indexShift("gallery", doc, 1, () => models.gallery.deleteOne(query, cb));
		})
	}
});

router.post('/gallery/reorder', (req, res) => {
	var id = req.body.gallery_to_reorder;
	var index = req.body.index;
	indexReorder("gallery", id, index, () => res.redirect(req.get("referrer")));
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
	indexShift("design", newDesign, 0, () => {
		newDesign.save(err => err ? res.send(err) : res.redirect(req.get("referrer")));
	});
});

router.post('/design/delete', (req, res) => {
	var all = req.body.design_to_delete === "*";
	var query = {_id: req.body.design_to_delete};
	var cb = err => err ? res.send(err) : res.redirect(req.get("referrer"));

	if (!all) {
		models.design.findOne(query, (err, doc) => {
			indexShift("design", doc, 1, () => models.design.deleteOne(query, cb));
		})
	} else {
		models.design.deleteMany({}, cb);
	}
});

module.exports = router;
