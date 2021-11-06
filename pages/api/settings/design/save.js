const { forEachOf } = require('async');
const { v2: cloud } = require('cloudinary');
const { Design } = require('../../../../models/models');
const { indexShift, photoUploader } = require('../../../../config/config');

export default async function handler(req, res) {
    if (req.method !== "POST") return req.next();
    if (!req.user) return res.status(401).send("Not logged in");
    const { d_id, client, tools, description, link, index, media, hidden } = req.body;
    const found = await Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} });
    if (found) return res.status(400).send("Design set already exists");
    const newDesign = new Design({ d_id, text: { client, tools, description }, link, index, hidden });
    try {
        await indexShift("Design", newDesign, { dec: false });
    } catch(err) {
        return res.status(500).send(err.message);
    }
    const files = (Array.isArray(media) ? media : [media]).filter(e => e);
    const saved_p_ids = [];
    newDesign.images = [];
    if (!files.length) return newDesign.save(() => res.send("Design saved"));
    forEachOf(files, (file, i, cb) => {
        const photo_set = `design-${newDesign.d_id}`;
        const photo_title = `${newDesign.d_id}-web${i+1}`;
        photoUploader({ file, photo_title, photo_set, index: i+1 }).then(photo => {
            saved_p_ids.push(photo.p_id);
            newDesign.images.push({ photo_url: photo.photo_url, index: photo.index });
            cb();
        }).catch(err => cb(err));
    }, async err => {
        if (!err) return newDesign.save(() => res.send("Design saved"));
        await cloud.api.delete_resources(saved_p_ids).catch(() => null);
        res.status(err.http_code || 500).send(err.message || err);
    });
}
