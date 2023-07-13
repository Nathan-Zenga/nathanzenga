const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { OAuth2 } = (require("googleapis")).google.auth;
const socket = require('./services/socket');
const MemoryStore = require('memorystore')(session);
const { PORT = 5678, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env;
const dev = process.env.NODE_ENV !== "production";
const next = require('next')({ dev });
const handle = next.getRequestHandler();

next.prepare().then(() => {
  app.use(bodyParser.json({ limit: "200mb" }));
  app.use(bodyParser.urlencoded({ limit: "200mb", extended: false }));
  app.use(cookieParser());

  // Express session
  app.use(session({
    secret: "secret",
    name: "sesh" + require("crypto").randomBytes(20).toString("hex"),
    saveUninitialized: true,
    resave: true,
    // cookie: { secure: false },
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 12 })
  }));

  // Passport config
  app.use(passport.initialize());
  app.use(passport.session());

  app.all('*', (req, res) => handle(req, res));

  const server = app.listen(PORT, () => {
    console.log(`Server started${dev ? " on port " + PORT : ""}`);

    if (!dev) setInterval(async () => {
      try {
        const oauth2Client = new OAuth2( OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, "https://developers.google.com/oauthplayground" );
        oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
        const response = await oauth2Client.getAccessToken();
        if (!response.token) throw Error("Null token");
      } catch (err) { console.error(err.message) }
    }, 1000 * 60 * 60 * 24 * 7)
  });

  socket(server);
})
