const { Photo } = require('../../../../../models/models');

export default async function handler(req, res) {
    const { id, photo_set } = req.body;
    if (!req.user) return res.status(403).send("Not logged in");
    if (!id || !photo_set) return res.status(400).send("Required field(s) missing");
    const oldCover = await Photo.findOne({ photo_set, photo_set_cover: true });
    const newCover = await Photo.findById(id);
    if (!oldCover || !newCover) return res.status(404).send("Old / new cover image not found");
    newCover.photo_set_cover = true;
    newCover.photo_set_index = oldCover.photo_set_index;
    newCover.save();
    oldCover.photo_set_cover = false;
    oldCover.photo_set_index = undefined;
    oldCover.save();
    res.send(`Cover image updated for ${photo_set} set`);
}
