var express = require('express'),
	router = express.Router(),
	galleries = require('../config/galleries'),
	nodemailer = require('nodemailer');

router.get('/', (req, res) => {
	res.render('index', {
		modalThumbsFigures: [
			[
				{ id: "witley", label: "Witley" },
				{ id: "say", label: "S.A.Y" },
				{ id: "blanqkanvas", label: "Blanq Kanvas" }
			],[
				{ id: "kojey", label: "Kojey Radical" },
				{ id: "kai", label: "Kai Rabai" },
				{ id: "sorom", label: "Sorom" }
			]
		],
		modalThumbsPlaces: [
			[
				{ id: "places1", label: "Appreciating Art" },
				{ id: "places2", label: "On Arabic Soil (Dubai, 2015)" }
			],[
				{ id: "fauna", label: "Fauna" }
			]
		]
	})
});

router.get('/get/galleries', (req, res) => {
	res.send(galleries);
});

router.post('/send/message', (req, res) => {
	let empty = false;
	for (k in req.body) if (req.body[k] === '') empty = true;
	if (empty) return res.send("Please fill in the missing field(s)");
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
		from: `"${req.body.name}" <${req.body.email}>`,
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

module.exports = router;