const async = require('async');
const { Design } = require('../../../../models/models');
const { indexShift, photoUploader } = require('../../../../config/config');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { d_id, client, tools, description, link, index, media, hidden } = req.body;
    const newDesign = new Design({ d_id, text: { client, tools, description }, link, index, hidden });
    const found = await Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} });
    if (found) return res.status(400).send("Design set already exists");
    const design = await newDesign.save();
    try {
        await indexShift("Design", design, { dec: false });
        const files = (Array.isArray(media) ? media : [media]).filter(e => e);
        design.images = [];
        if (!files.length) return res.send("Design saved");
        async.forEachOf(files, (file, i, cb) => {
            const photo_set = `design-${design.d_id}`;
            const photo_title = `${design.d_id}-web${i+1}`;
            photoUploader({ file, photo_title, photo_set, index: i+1 }).then(photo => {
                design.images.push({ photo_url: photo.photo_url, index: photo.index });
                cb();
            }).catch(err => cb(err));
        }, err => {
            if (err) return res.status(500).send(err.message || err);
            design.save(() => res.send("Design saved"))
        });
    } catch(err) { res.status(err.http_code || 500).send(err.message) }
}
