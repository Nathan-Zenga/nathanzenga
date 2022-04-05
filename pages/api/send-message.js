const sendMail = require('../../config/send-mail');

export default async function handler(req, res) {
  if (req.method !== "POST") return req.next();

  try {
    await sendMail(req.body);
    console.log("The message was sent!");
    res.send('Message sent');
  } catch (err) { res.status(500).send(err.message) }
}
