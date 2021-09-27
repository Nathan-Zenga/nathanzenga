const { Photo, Design } = require('../../../../models/models');
const { indexReorder } = require('../../../../config/config');

export default async function handler(req, res) {
    if (!req.user) return res.status(401).send("Not logged in");
    const { id, index, photo_set } = req.body;
    try {
        await indexReorder("Photo", { id, newIndex: index, filterQry: { photo_set } });
        if (!/^design-/.test(photo_set)) return res.send("Photo re-ordered in set: " + photo_set);
        const design = await Design.findOne({ d_id: photo_set.replace("design-", "") });
        if (!design) return res.send("Design not found");
        const photos = await Photo.find({ photo_set }).sort({ index: 1 }).exec();
        design.images = [];
        photos.forEach(p => { design.images.push({ photo_url: p.photo_url, index: p.index }) });
        await design.save(); res.send("Photo re-ordered in set: " + photo_set);
    } catch(err) { res.status(500).send(err) }
}
