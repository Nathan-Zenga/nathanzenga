const passport = require('../../../config/passport');

export default function handler(req, res) {
  req.body.username = "admin";
  passport.authenticate("admin-login", { session: true }, (err, user, info) => {
    if (err) return res.status(500).send(err.message || err);
    if (!user) return res.status(400).send(info.message);
    req.login(user, err => {
      if (err) return res.status(500).send(err.message || err);
      res.send("/settings/---");
    });
  })(req, res);
}
