const cloud = require('cloudinary');
const { Photo, Design } = require('../../../../../models/models');

export default async function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");

    const { photo_set } = req.body;
    if (!photo_set) return res.send("Nothing selected");
    try {
        const photos = await Photo.find({ photo_set });
        await cloud.v2.api.delete_resources(photos.map(photo => photo.p_id));
        await Photo.deleteMany({ photo_set });
    } catch(err) { return res.status(err.http_code || 500).send(err.message) }

    const covers = await Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec();
    const design_set = /^design-/i.test(photo_set);
    if (design_set) {
        const d_id = photo_set.replace("design-", "");
        const design = await Design.findOneAndDelete({ d_id });
        if (!design) return res.status(404).send(d_id + " design set not found");
        res.send(design.d_id + " design set deleted successfully");
    } else {
        covers.forEach((cover, i) => {
            if (cover.photo_set_index != i+1) {
                cover.photo_set_index = i+1;
                cover.save();
            }
        });
        res.send(photo_set + " set deleted successfully")
    }
}
