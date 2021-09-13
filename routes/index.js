const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { OAuth2 } = (require("googleapis")).google.auth;
const { Design, Info_text, Photo } = require('../models/models');
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env;

router.get('/designs/-', async (req, res) => {
    const { tools } = req.query;
    const filter = Object.assign({ hidden: false }, tools ? { "text.tools": new RegExp(tools, "i") } : {});
    const designs = await Design.find(filter).sort({ index: 1 }).exec();
    const design_docs = await Photo.find({ photo_set: /^design-/ }).sort({ photo_set: 1, orientation: 1, index: 1 }).exec();
    res.send({ designs, design_docs });
});

router.get('/info/-', (req, res) => {
    Info_text.findOne((err, txt) => res.send(txt))
});

router.post('/p', async (req, res) => {
    const qry = { ...req.body, sort: undefined };
    if (qry.photo_set) qry.photo_set = { $regex: RegExp(`^${qry.photo_set}$`, "i") };
    const photos = await Photo.find(qry).sort(JSON.parse(req.body.sort || "{}")).exec();
    res.send(photos);
});

router.post('/send/message', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const from = { name, address: email };
    const to = "nathanzenga@gmail.com";
    const text = `From ${name} (${email}):\n\n${message}`;
    const oauth2Client = new OAuth2( OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, "https://developers.google.com/oauthplayground" );
    oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });
    try {
        const response = await oauth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail', // port: 465, // secure: true,
            auth: {
                type: "OAuth2",
                user: "nathanzenga@gmail.com",
                clientId: OAUTH_CLIENT_ID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN,
                accessToken: response.token
            },
            tls: { rejectUnauthorized: true }
        });

        await transporter.sendMail({ from, to, subject, text });
        console.log("The message was sent!");
        res.send('Message sent');
    } catch (err) { res.status(500).send(err.message) }
});

module.exports = router;
