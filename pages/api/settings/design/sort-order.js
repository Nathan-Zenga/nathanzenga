const { indexReorder } = require('../../../../config/config');

export default function handler(req, res) {
    if (req.method !== "POST") return req.next();
    if (!req.user) return res.status(401).send("Not logged in");
    const { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index })
    .then(_ => { res.send("Design set re-ordered") })
    .catch(err => { res.status(500).send(err.message || err) })
}
