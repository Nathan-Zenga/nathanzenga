const cloud = require('cloudinary');
const { Photo, Design } = require('../../../../models/models');

export default async function handler(req, res) {
    if (req.method !== "POST") return req.next();
    const { id } = req.body;
    if (!req.user) return res.status(401).send("Not logged in");
    if (!id) return res.send("Nothing selected");
    const photo_deleted = await Photo.findByIdAndDelete(id);
    if (!photo_deleted) return res.send("Photo not found");
    const { photo_set, photo_url, photo_set_cover, photo_set_index } = photo_deleted;
    const set = await Photo.find({ photo_set }).sort({ index: 1 }).exec();
    const design = await Design.findOne({ d_id: photo_set.replace("design-", "") });
    await cloud.v2.api.delete_resources([photo_deleted.p_id]);
    set.forEach((p, i) => {
        if (i === 0 && photo_set_cover && photo_set_index) {
            p.photo_set_cover = true;
            p.photo_set_index = photo_set_index;
        }
        p.index = i+1;
        p.save();
    });
    if (!design) return res.send("Photo deleted");
    design.images = design.images.filter(url => url !== photo_url);
    for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
    await design.save().then(_ => res.send("Photo deleted")).catch(err => res.status(400).send(err.message));
}
