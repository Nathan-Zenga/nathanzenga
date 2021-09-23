const { Photo, Design } = require('../../../../models/models');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, d_id, client, tools, description, link, hidden } = req.body;
    const filter = Object.assign({ _id: id }, d_id ? { d_id } : {});
    const doc = await Design.findOne(filter);
    if (!doc) return res.status(404).send("Design item not found");
    if (client) doc.text.client = client;
    if (tools) doc.text.tools = tools;
    if (description) doc.text.description = description;
    if (link) doc.link = link;
    doc.hidden = !!hidden;
    if (d_id && doc.d_id !== d_id) {
        Photo.updateMany({photo_set: `design-${doc.d_id}`}, {$set: {photo_set: `design-${d_id}`}}, (err, result) => {
            if (err) return res.status(500).send(err.message || "Error occurred whilst photos updating photo set");
            console.log(result);
            const { n, nModified } = result;
            const msg = n === nModified && nModified > 0 ? "" : ".\nNone or some of the d_id fields were modified";
            if (n === nModified && nModified > 0) doc.d_id = d_id;
            doc.save(err => res.send("Design collection updated" + msg));
        });
    } else { doc.save(err => res.send("Design collection updated")) }
}
