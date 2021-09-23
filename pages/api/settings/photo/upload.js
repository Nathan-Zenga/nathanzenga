const { Photo, Design } = require('../../../../models/models');
const { indexShift, photoUploader } = require('../../../../config/config');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { photo_set, photo_set_new, photo_url, index } = req.body;
    const design = await Design.findOne({ d_id: photo_set.replace("design-", "") });
    const existingSet = await Photo.find({ photo_set: {$regex: new RegExp(`^${(photo_set_new || "").trim()}$`, "i")} });
    if (/^design-/i.test(photo_set_new || photo_set) && !design) return res.status(400).send("Please create Design document first");
    if (existingSet.length) return res.status(400).send("Set already exists. Please specify a different one");
    req.body.photo_set = photo_set_new || photo_set;
    photoUploader(req.body, (err, photo) => {
        if (err) return res.send(err);
        indexShift("Photo", photo, { dec: false }, err => {
            if (err) return console.error(err), res.status(500).send(err);
            if (design) {
                const indexParsed = parseInt(index);
                design.images.splice(indexParsed-1, 0, { photo_url, indexParsed });
                for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
                design.save();
            } else if (photo_set_new) {
                photo.photo_set_cover = true;
                photo.photo_set_index = 1;
                photo.save((err, saved) => {
                    Photo.find({ photo_set_cover: true, _id: {$ne: saved.id} }).sort({photo_set_index: 1}).exec((err, covers) => {
                        covers.forEach((cover, i) => {
                            cover.photo_set_index = i+2;
                            cover.save();
                        })
                    })
                })
            }
            if (err) console.error(err);
            res.send(err || "Photo saved");
        })
    })
}
