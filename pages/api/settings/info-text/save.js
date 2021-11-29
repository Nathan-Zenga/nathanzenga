const { Info_text } = require('../../../../models/models');

export default async function handler(req, res) {
  if (req.method !== "POST") return req.next();
  if (!req.user) return res.status(401).send("Not logged in");
  const info = await Info_text.findOne() || new Info_text();
  info.text = req.body.text;
  info.save(e => res.status(e ? 400 : 200).send(e ? e.message : "Info text saved"));
}
