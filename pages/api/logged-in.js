export default function handler(req, res) {
  if (req.method !== "POST") return req.next();
  res.status(200).send(!!req.user);
}
