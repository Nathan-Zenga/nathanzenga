const async = require('async');
const { Design } = require('../../../../models/models');
const { indexShift, photoUploader } = require('../../../../config/config');

export default async function handler(req, res) {
    const { d_id, client, tools, description, link, index, media, hidden } = req.body;
    const newDesign = new Design({ d_id, text: { client, tools, description }, link, index, hidden });
    const found = await Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} });
    if (found) return res.status(400).send("Design set already exists");
    const design = await newDesign.save();
    indexShift("Design", design, { dec: false }, err => {
        if (err) return res.status(500).send(err);
        const files = (Array.isArray(media) ? media : [media]).filter(e => e);
        design.images = [];
        if (!files.length) return res.send("Design saved");
        async.forEachOf(files, (file, i, cb) => {
            const photo_set = `design-${design.d_id}`;
            const photo_title = `${design.d_id}-web${i+1}`;
            photoUploader({ file, photo_title, photo_set, index: i+1 }, (err, photo) => {
                if (err) return cb(err.message || err);
                design.images.push({ photo_url: photo.photo_url, index: photo.index });
                cb();
            });
        }, err => {
            if (err) return res.status(500).send(err.message || err);
            design.save(() => res.send("Design saved"))
        });
    });
}
