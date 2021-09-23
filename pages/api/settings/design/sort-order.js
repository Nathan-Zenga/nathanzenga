const { indexReorder } = require('../../../../config/config');

export default function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index }, err => {
        if (err) return res.status(500).send(err.message || err);
        res.send("Design set re-ordered")
    });
}
