var express = require('express'),
	router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		title: '',
		page: 'index',
		gallery: 'assorted'
	});
});

router.post('/send/message', (req, res) => {
	console.log(req.body);
	res.send("Messege Sent");
});

module.exports = router;