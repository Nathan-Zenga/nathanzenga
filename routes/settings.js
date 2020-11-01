const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Photo, Design, Info_text, Admin } = require('../models/models');
const production = process.env.NODE_ENV === "production";

router.get('/---', async (req, res) => {
    if (req.session.isAuthed || !production) {
        const photos = await Photo.find().sort({photo_set: 1, index: 1}).exec();
        const designs = await Design.find().sort({index: 1}).exec();
        const info = (await Info_text.find())[0];
        res.render('settings', { title: "Settings", pagename: "settings", photos, designs, info })
    } else res.redirect("/settings/access");
});

router.get('/access', (req, res) => {
    if (!req.session.isAuthed && production) {
        const flash_msg = req.session.flash_msg;
        res.render('access', { title: "Password Required", pagename: "access", flash_msg }, (err, html) => {
            req.session.flash_msg = undefined;
            res.send(html);
        })
    } else res.redirect("/settings/---");
});

router.post('/*', (req, res, next) => {
    if (req.originalUrl !== "/settings/access" && req.session.isAuthed) req.session.cookie.maxAge = production ? 120000 : Infinity;
    next();
});

router.post('/access', async (req, res) => {
    const doc = await Admin.findOne();
    const match = bcrypt.compareSync(req.body.pass, doc.pass);
    if (match) {
        req.session.cookie.maxAge = 120000; // 2 mins
        req.session.isAuthed = true;
    } else {
        req.session.flash_msg = "Invalid Password";
    }
    res.redirect("/settings/---");
});

router.post('/info-text/save', async (req, res) => {
    const info = await Info_text.findOne();
    const newInfo = info ? info : new Info_text();
    newInfo.text = req.body.text;
    newInfo.save(err => {
        if (err) return console.log(err), res.send(err.message);
        res.send("Info text saved");
    });
});

module.exports = router;
