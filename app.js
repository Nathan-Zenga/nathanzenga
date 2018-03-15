// import modules
var express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	http = require('http'), // core module
	path = require('path'), // core module
	ejs = require('ejs'),
	FACTORIAL = path.join(__dirname, 'build', 'factorial.min.js');

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use(function (req, res, next) {
	// res.locals.errors = null;
	next();
});

app.use('/', require('./routes/index'));

// Set port + listen for requests
var port = process.env.PORT || 5678;
app.listen(port, function() {
	console.log('Server started on port '+ port);
});