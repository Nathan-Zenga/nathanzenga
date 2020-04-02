var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var { OAuth2 } = require("googleapis").google.auth;
var models = require('../models/models');
var { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN, FLICKR_KEY } = process.env;

router.get('/', (req, res) => {
    res.render('index', { title: null, pagename: "home" })
});

router.get('/photo', (req, res) => {
    models.gallery.find().sort({index: 1}).exec((err, galleries) => {
        res.render('photo', { title: "Photography", pagename: "photo", galleries })
    })
});

router.get('/design', (req, res) => {
    models.design.find().sort({index: 1}).exec((err, designs) => {
        res.render('design', { title: "Designs", pagename: "design", designs })
    })
});

router.get('/artwork', (req, res) => {
    res.render('artwork', { title: "Artwork", pagename: "artwork" })
});

router.get('/info', (req, res) => {
    models.info_text.find((err, txt) => {
        res.render('info', { title: "Info", pagename: "info", txt: txt[0] })
    })
});

router.post('/key', (req, res) => res.send(FLICKR_KEY));

router.post('/send/message', (req, res) => {
    const oauth2Client = new OAuth2( OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, "https://developers.google.com/oauthplayground" );
    oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: 465,
        // secure: true,
        auth: {
            type: "OAuth2",
            user: "nathanzenga@gmail.com",
            clientId: OAUTH_CLIENT_ID,
            clientSecret: OAUTH_CLIENT_SECRET,
            refreshToken: OAUTH_REFRESH_TOKEN,
            accessToken
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    transporter.sendMail({
        from: { name: req.body.name, address: req.body.email },
        to: 'nathanzenga@gmail.com',
        subject: req.body.subject,
        text: `From ${req.body.name} (${req.body.email}):\n\n${req.body.message}`
    },
    (err, info) => {
        if (err) return console.log(err), res.send("Could not send message. Error occurred.");
        console.log("The message was sent!");
        console.log(info);
        transporter.close();
        res.send('Message sent');
    });
});

module.exports = router;
