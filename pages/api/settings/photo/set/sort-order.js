const { Photo } = require('../../../../../models/models');

export default async function handler(req, res) {
    if (!req.user) return res.status(401).send("Not logged in");
    const { photo_set, photo_set_index } = req.body;
    const covers = await Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec();
    if (!covers.length) return res.status(404).send("No photosets present to process this request");
    const index = covers.findIndex(e => e.photo_set == photo_set);
    if (index < 0) return res.status(404).send("Photoset not found or doesn't exit"); 
    const beforeSelectedDoc = covers.slice(0, index);
    const afterSelectedDoc = covers.slice(index+1, covers.length);
    const docs_mutable = [...beforeSelectedDoc, ...afterSelectedDoc];
    docs_mutable.splice(parseInt(photo_set_index)-1, 0, covers[index]);
    docs_mutable.forEach((set, i, a) => {
        set.photo_set_index = i+1;
        set.save(() => { if (i === a.length-1) res.send("Photo set cover reordered") })
    })
}
