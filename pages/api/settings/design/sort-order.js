const { indexReorder } = require('../../../../config/config');

export default function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index })
    .then(_ => { res.send("Design set re-ordered") })
    .catch(err => { res.status(500).send(err.message || err) })
}
