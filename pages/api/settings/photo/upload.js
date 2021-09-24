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
    try {
        const photo = await photoUploader(req.body);
        await indexShift("Photo", photo, { dec: false });
        if (design) {
            const indexParsed = parseInt(index);
            design.images.splice(indexParsed-1, 0, { photo_url, indexParsed });
            for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
            await design.save();
        } else if (photo_set_new) {
            photo.photo_set_cover = true;
            photo.photo_set_index = 1;
            const saved = await photo.save();
            const covers = await Photo.find({ photo_set_cover: true, _id: {$ne: saved.id} }).sort({photo_set_index: 1}).exec();
            await Promise.all(covers.map((c, i) => { c.photo_set_index = i+2; return c.save() }))
        }
        res.send("Photo saved");
    } catch(err) { res.status(err.http_code || 500).send(err.message) }
}
