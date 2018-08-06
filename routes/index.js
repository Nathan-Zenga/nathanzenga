var express = require('express'),
	router = express.Router(),
	sublist = require('../config/sublist');

router.get('/', (req, res) => {
	res.render('index', {
		title: '',
		page: 'index',
		gallery: 'assorted'
	});
});

router.get('/about', (req, res) => {
	res.render('about', {
		title: 'About / ',
		page: 'about'
	});
});

router.get('/video', (req, res) => {
	res.render('video', {
		title: 'Videography / ',
		page: 'video',
		sublist: sublist.video,
		gallery: sublist.video[0][0].slice(0,-1)
	});
});

router.get('/:page', (req, res) => {

	var p = req.params.page;
	var t = (/photo|video/.test(p)) ? p + 'graphy' : p;

	res.render('index', {
		title: t.charAt(0).toUpperCase() + t.slice(1) + ' / ',
		page: p,
		sublist: sublist[p],
		gallery: p == 'art' ? p : sublist[p][0][0].slice(0,-1)
	});
});

module.exports = router;