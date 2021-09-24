const { Photo, Design } = require('../../../../models/models');
const { indexShift, photoUploader } = require('../../../../config/config');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, photo_title, photo_set } = req.body;
    const photo = await Photo.findById(id);
    const design = await Design.findOne({ d_id: photo_set.replace("design-", "") });
    if (/^design-/.test(photo_set) && !design) return res.status(404).send("Design document does not exist, please create one first");
    const prev_photo_set = photo.photo_set;
    const sameAsPrevPhotoSet = (new RegExp("^"+photo_set.trim()+"$", "i")).test(prev_photo_set);
    if (photo_set === "Assorted" && !sameAsPrevPhotoSet) {
        try {
            let { photo_url, photo_title, index } = photo;
            const saved = await photoUploader({ photo_title, index, file: photo_url, photo_set: "Assorted" });
            await indexShift("Photo", saved, null);
            res.send(`Image (${saved.photo_title}) saved in Assorted set`);
        } catch (err) { res.status(err.http_code || 500).send(err.message) }
    } else {
        if (photo_title) photo.photo_title = photo_title;
        if (photo_set && !sameAsPrevPhotoSet) photo.photo_set = photo_set;
        const edited = await photo.save();
        if (photo_set && !sameAsPrevPhotoSet) {
            const set = await Photo.find({ photo_set }).sort({ index: 1 }).exec();
            const setCoverPresent = !!set.filter(p => p.photo_set_cover && p.photo_set_index && p.id != edited.id).length;
            if (photo.photo_set_cover && photo.photo_set_index && setCoverPresent) {
                edited.photo_set_cover = false;
                edited.photo_set_index = undefined;
            }
            edited.index = set.length + 1;
            const edited2 = await edited.save();
            const photos = await Photo.find({ photo_set: prev_photo_set }).sort({ index: 1 }).exec();
            const initial_ps_index = photo.photo_set_index;
            photos.forEach((p, i) => {
                if (i == 0 && photo.photo_set_cover && photo.photo_set_index && !/^design-/.test(photo_set)) {
                    p.photo_set_cover = true;
                    p.photo_set_index = initial_ps_index;
                }
                p.index = i+1;
                p.save();
            });
            if (/^design-/.test(prev_photo_set)) {
                const prev_design = await Design.findOne({ d_id: prev_photo_set.replace("design-", "") });
                if (prev_design) {
                    prev_design.images = prev_design.images.filter(e => e.photo_url !== edited2.photo_url);
                    for (let i = 0; i < prev_design.images.length; i++) prev_design.images[i].index = i+1;
                    prev_design.save();
                }
            }
            var msg = `Photo edited and moved to ${photo_set} set successfully`;
            if (/^design-/.test(photo_set) && design) {
                design.images.push({ photo_url: edited2.photo_url, index: edited2.index });
                design.save(() => res.send(msg));
            } else {
                res.send(msg);
            }
        } else {
            res.send("Photo edited successfully");
        }
    }
}
