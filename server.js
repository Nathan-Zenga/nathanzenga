const express = require('express');
const server = express();
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const sendMail = require('./config/send-mail');
const MemoryStore = require('memorystore')(session);
const { PORT = 5678, TEST_EMAIL } = process.env;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.use(bodyParser.json({ limit: "200mb" }));
  server.use(bodyParser.urlencoded({ limit: "200mb", extended: false }));
  server.use(cookieParser());

  // Express session
  server.use(session({
    secret: "secret",
    name: "sesh" + require("crypto").randomBytes(20).toString("hex"),
    saveUninitialized: true,
    resave: true,
    // cookie: { secure: false },
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 12 })
  }));

  // Passport config
  server.use(passport.initialize());
  server.use(passport.session());

  server.all('*', (req, res) => handle(req, res));
  server.listen(PORT, () => {
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
})
