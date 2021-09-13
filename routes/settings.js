const router = require('express').Router();
const { Info_text } = require('../models/models');
const passport = require('../config/passport');

router.post('/access', async (req, res) => {
    req.body.username = "admin";
    passport.authenticate("admin-login", { session: true }, (err, user, info) => {
        if (err) return res.status(500).send(err.message || err);
        if (!user) return res.status(400).send(info.message);
        req.login(user, err => {
            if (err) return res.status(500).send(err.message || err);
            res.send("/settings/---");
        });
    })(req, res);
});

router.post('/info-text/save', async (req, res) => {
    const info = await Info_text.findOne();
    const newInfo = info ? info : new Info_text();
    newInfo.text = req.body.text;
    await newInfo.save().catch(err => res.status(400).send(err.message));
    res.send("Info text saved");
});

module.exports = router;
