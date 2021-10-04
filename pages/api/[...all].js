export default function handler(req, res) {
  if (req.method === "GET") return res.status(404).redirect("/404");
  res.status(400).send("Sorry, your request currently cannot be processed")
}
