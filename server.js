const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const sendMail = require('./config/send-mail');
const socket = require('./services/socket');
const MemoryStore = require('memorystore')(session);
const { PORT = 5678, TEST_EMAIL } = process.env;
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

    if (!dev) try {
      setInterval(async () => {
        const email = "nathanzenga@gmail.com";
        const recipient_email = TEST_EMAIL;
        const subject = "Re: NZ test email";
        const message = "This is a test email message";
        await sendMail({ email, recipient_email, subject, message });
      }, 1000 * 60 * 10)
    } catch (err) { console.error(err.message) }
  });

  socket(server);
})
