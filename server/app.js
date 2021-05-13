const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path'); // core module
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const production = process.env.NODE_ENV === "production";

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => { console.log("Connected to DB") });

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }));
app.use(cookieParser());

// Set static folder
app.use(express.static(path.join(__dirname, '../../ui/build')));

// Express session
app.use(session({
    secret: 'secret',
    name: "session" + Math.round(Math.random()*1000000),
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false },
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 12 })
}));

// Global variables
app.use((req, res, next) => {
    res.locals.production = production;
    res.locals.url = req.originalUrl;
    next();
});

app.use('/', require('./routes/index'));
app.use('/settings', require('./routes/settings'));
app.use('/settings/photo', require('./routes/photo-settings'));
app.use('/settings/design', require('./routes/design-settings'));

app.get("*", (req, res) => res.status(404).send({ title: "Error 404", pagename: "error" }));
app.post("*", (req, res) => res.status(400).send("Sorry, your request currently cannot be processed"));

const port = process.env.PORT || 5678;
app.listen(port, _ => console.log('Server started on port '+ (production ? "" : port)));
