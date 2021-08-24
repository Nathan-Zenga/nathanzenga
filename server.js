const express = require('express');
const server = express();
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const port = process.env.PORT || 5678;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', _ => { console.log("Connected to DB") });

server.use(bodyParser.json({ limit: "200mb" }));
server.use(bodyParser.urlencoded({ limit: "200mb", extended: false }));
server.use(cookieParser());

// Express session
server.use(session({
  secret: "secret",
  name: "session" + Math.round(Math.random()*1000000),
  saveUninitialized: true,
  resave: true,
  cookie: { secure: false },
  store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 12 })
}));

// Global variables
server.use((req, res, next) => {
  res.locals.production = !dev;
  res.locals.url = req.originalUrl;
  next();
});

app.prepare().then(() => {
  server.use('/api/', require('./routes/index'));
  server.use('/api/settings', require('./routes/settings'));
  server.use('/api/settings/photo', require('./routes/photo-settings'));
  server.use('/api/settings/design', require('./routes/design-settings'));
  server.post('*', (req, res) => res.status(400).send("Sorry, your request currently cannot be processed"));
  server.all('*', (req, res) => handle(req, res));
  server.listen(port, () => { console.log(`Server started ${!dev ? "" : "on port " + port}`) });
})
