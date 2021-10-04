const nodemailer = require('nodemailer');
const { OAuth2 } = (require("googleapis")).google.auth;
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN } = process.env;

export default async function handler(req, res) {
  if (req.method !== "POST") return req.next();
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
}
