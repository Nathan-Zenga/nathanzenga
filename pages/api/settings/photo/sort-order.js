const { Photo, Design } = require('../../../../models/models');
const { indexReorder } = require('../../../../config/config');

export default function handler(req, res) {
    if (!req.user) return res.status(403).send("Not logged in");
    const { id, index, photo_set } = req.body;
    indexReorder("Photo", { id, newIndex: index, filterQry: { photo_set } }, err => {
        if (err) return res.status(500).send(err);
        if (/^design-/.test(photo_set)) {
            Design.findOne({ d_id: photo_set.replace("design-", "") }, (err, design) => {
                if (err) return console.error(err), res.send("Error occurred during query search"); 
                if (!design) return res.send("Design not found");
                Photo.find({ photo_set }).sort({ index: 1 }).exec((err, photos) => {
                    design.images = [];
                    photos.forEach(p => {
                        design.images.push({ photo_url: p.photo_url, index: p.index });
                    });
                    design.save(() => res.send("Photo re-ordered in set: " + photo_set));
                })
            })
        } else { res.send("Photo re-ordered in set: " + photo_set) }
    });
}
