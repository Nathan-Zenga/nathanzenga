var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http'); // core module
var path = require('path'); // core module
var ejs = require('ejs');
var mongoose = require('mongoose');
var session = require('express-session');
var production = (process.env.NODE_ENV === "production");

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

let conn = mongoose.connection;
conn.once('open', function() {
	console.log("Connected to DB")
});

var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true,
	cookie: {
		secure: false
	}
}));

// Global variables
app.use(function (req, res, next) {
	res.locals.production = production;
	res.locals.url = req.originalUrl;
	next();
});

app.use('/', require('./routes/index'));
app.use('/settings', require('./routes/settings'));

app.get("*", (req, res) => {
	res.status(404).render('index', { title: "Error 404", pagename: "error" });
});

// Set port + listen for requests
var port = process.env.PORT || 5678;
app.listen(port, function() {
	console.log('Server started on port '+ port);
	if (production) {
		setInterval(function() {
			http.get(process.env.URL);
		}, 60000 * 25);
	}
});
