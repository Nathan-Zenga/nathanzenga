const { Info_text } = require('../../../../models/models');

export default async function handler(req, res) {
  if (!req.user) return res.status(401).send("Not logged in");
  const info = await Info_text.findOne() || new Info_text();
  info.text = req.body.text;
  await info.save().catch(err => res.status(400).send(err.message));
  res.send("Info text saved");
}
