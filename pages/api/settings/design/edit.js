const { Photo, Design } = require('../../../../models/models');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, d_id, client, tools, description, link, hidden } = req.body;
    const filter = Object.assign({ _id: id }, d_id ? { d_id } : {});
    const doc = await Design.findOne(filter).catch(_ => null);
    if (!doc) return res.status(404).send("Design item not found");
    if (client) doc.text.client = client;
    if (tools) doc.text.tools = tools;
    if (description) doc.text.description = description;
    if (link) doc.link = link;
    doc.hidden = !!hidden;
    if (!d_id || doc.d_id === d_id) return doc.save(_ => res.send("Nothing changed"));
    const { matchedCount: matched, modifiedCount: changed } = await Photo.updateMany({photo_set: `design-${doc.d_id}`}, {$set: {photo_set: `design-${d_id}`}});
    const allModified = matched === changed && changed > 0;
    const msg = `.\n${matched - changed}/${matched} "${doc.d_id}" images not matched for re-grouping under the new collection name ${d_id}`;
    if (allModified) doc.d_id = d_id;
    doc.save(_ => res.send(`Design collection updated${allModified ? "" : msg}`));
}
