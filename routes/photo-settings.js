const router = require('express').Router();
const cloud = require('cloudinary');
const { Photo, Design } = require('../models/models');
const { indexShift, indexReorder, photoUploader } = require('../config/config');
const { each } = require('async');

router.post('/upload', async (req, res) => {
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
});

router.post('/edit', async (req, res) => {
    const { id, photo_title, photo_set } = req.body;
    const photo = await Photo.findById(id);
    const design = await Design.findOne({ d_id: photo_set.replace("design-", "") });
    if (/^design-/.test(photo_set) && !design) return res.status(404).send("Design document does not exist, please create one first");
    const prev_photo_set = photo.photo_set;
    const sameAsPrevPhotoSet = (new RegExp("^"+photo_set.trim()+"$", "i")).test(prev_photo_set);
    if (photo_set === "Assorted" && !sameAsPrevPhotoSet) {
        let { photo_url, photo_title, index } = photo;
        photoUploader({ photo_title, index, file: photo_url, photo_set: "Assorted" }, (err, saved) => {
            if (err) return console.error(err), res.send("Error occurred whilst uploading to Assorted");
            indexShift("Photo", saved, null, err => res.send(err || `Image (${saved.photo_title}) saved in Assorted set`));
        })
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
});

router.post('/delete', async (req, res) => {
    const { id } = req.body;
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
    if (design) {
        design.images = design.images.filter(url => url !== photo_url);
        for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
        design.save();
    }
    res.send("Photo deleted");
});

router.post('/sort-order', (req, res) => {
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
});

router.post('/set/delete', async (req, res) => {
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
});

router.post('/set/sort-order', async (req, res) => {
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
});

router.post('/set/cover', async (req, res) => {
    const { id, photo_set } = req.body;
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
});

module.exports = router;
