var express = require('express');
var router = express.Router();
var galleries = require('../config/galleries');
var nodemailer = require('nodemailer');
var models = require('../models/models');

router.get('/', (req, res) => {
	res.render('index', { title: null, pagename: "home" })
});

router.get('/photo', (req, res) => {
	models.gallery.find((err, docs) => {
		res.render('photo', { title: "Photography", pagename: "photo", docs })
	})
});

router.get('/design', (req, res) => {
	models.design.find((err, docs) => {
		res.render('design', { title: "Designs", pagename: "design", docs })
	})
});

router.get('/info', (req, res) => {
	models.info_text.find((err, txt) => {
		res.render('info', { title: "Info", pagename: "info", txt: txt[0] })
	})
});

router.get('/---settings---', (req, res) => {
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

router.post('/galleries', (req, res) => {
	res.send(galleries);
});

router.post('/save/*', (req, res) => {
	switch (req.path) {
		case "/save/gallery":
			var newGallery = new models.gallery({
				gallery: req.body.gallery,
				label: req.body.label
			});
			newGallery.save(err => { if (err) return res.send(err) })
			break;

		case "/save/designs":
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

		case "/save/info-text":
			var newInfo = new models.design({
				info: req.body.info
			});
			newInfo.save(err => { if (err) return res.send(err) })
			break;
	}
	res.send("Saved!");
});

router.post('/send/message', (req, res) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 465,
		secure: true,
		auth: {
			user: 'nznodemailer@gmail.com',
			pass: 'nodemailer246'
		},
		tls: {
			rejectUnauthorized: true
		}
	});

	let mailOptions = {
		from: { name: req.body.name, address: req.body.email },
		to: 'nathanzenga@gmail.com',
		subject: req.body.subject,
		text: `From ${req.body.name} (${req.body.email}):\n\n${req.body.message}`
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) return console.log(err), res.send("Could not send message");
		console.log("The message was sent!");
		console.log(info);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.send('Message sent');
	});
});

module.exports = router;