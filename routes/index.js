const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { OAuth2 } = require("googleapis").google.auth;
const { Design, Info_text, Photo } = require('../models/models');
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env;

router.get('/', (req, res) => {
    res.render('index', { title: null, pagename: "home" })
});

router.get('/photo', (req, res) => {
    res.render('photo', { title: "Photography", pagename: "photo" })
});

router.get('/design', (req, res) => {
    Design.find().sort({index: 1}).exec((err, designs) => {
        res.render('design', { title: "Designs", pagename: "design", designs })
    })
});

router.get('/artwork', (req, res) => {
    res.render('artwork', { title: "Artwork", pagename: "artwork" })
});

router.get('/info', (req, res) => {
    Info_text.findOne((err, txt) => {
        res.render('info', { title: "Info", pagename: "info", txt })
    })
});

router.post('/p', (req, res) => {
    var qry = Object.assign({}, req.body);
    delete qry.sort;
    qry.photo_set = {$regex: new RegExp(qry.photo_set, "i")};
    Photo.find(qry).sort(JSON.parse(req.body.sort || "{}")).exec((err, photos) => res.send(photos))
});

router.post('/send/message', (req, res) => {
    const { name, email, subject, message } = req.body;
    const oauth2Client = new OAuth2( OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, "https://developers.google.com/oauthplayground" );
    oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
    oauth2Client.getAccessToken((err, accessToken) => {
        if (err) return console.error(err), res.send(err.message || "Error getting access token");
        const transporter = nodemailer.createTransport({
            service: 'gmail', // port: 465, // secure: true,
            auth: {
                type: "OAuth2",
                user: "nathanzenga@gmail.com",
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN,
                accessToken
            },
            tls: { rejectUnauthorized: true }
        });

        transporter.sendMail({
            from: { name, address: email },
            to: 'nathanzenga@gmail.com',
            subject,
            text: `From ${name} (${email}):\n\n${message}`
        }, err => {
            if (err) return console.error(err), res.send("Could not send message. Error occurred.");
            console.log("The message was sent!");
            res.send('Message sent');
        });
    });
});

module.exports = router;
