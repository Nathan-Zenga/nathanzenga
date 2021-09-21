const passport = require('../../../config/passport');

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    req.body.username = "admin";
    passport.authenticate("admin-login", { session: true }, (err, user, info) => {
      if (err) return res.status(500).send(err.message || err), reject();
      if (!user) return res.status(400).send(info.message), reject();
      req.login(user, err => {
        if (err) return res.status(500).send(err.message || err), reject();
        res.send("/settings/---");
        resolve();
      });
    })(req, res);
  })
}
