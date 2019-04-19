var express = require('express'),
	router = express.Router(),
	galleries = require('../config/galleries'),
	nodemailer = require('nodemailer');

router.get('/', (req, res) => {
	res.render('index', { title: null, pagename: "home" })
});

router.get('/photo', (req, res) => {
	res.render('photo', { title: "Photography", pagename: "photo" })
});

router.get('/design', (req, res) => {
	res.render('design', { title: "Designs", pagename: "design" })
});

router.get('/info', (req, res) => {
	res.render('info', { title: "Info", pagename: "info" })
});

router.get('/get/galleries', (req, res) => {
	res.send(galleries);
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

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) return console.log(err), res.send("Could not send message");
		console.log("The message was sent!");
		console.log(info);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.send('Message sent');
	});
});

router.get("*", (req, res) => {
	res.status(404).render('index', { title: "Error 404", pagename: "error" });
});

module.exports = router;