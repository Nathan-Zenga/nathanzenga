const router = require('express').Router();
const async = require('async');
const { Photo, Design } = require('../models/models');
const { indexShift, indexReorder, photoUploader } = require('../config/config');

router.post('/design/save', async (req, res) => {
    const { d_id, client, tools, description, link, index, media, hidden } = req.body;
    const newDesign = new Design({ d_id, text: { client, tools, description }, link, index, hidden });
    const found = await Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} });
    if (found) return res.status(400).send("Design set already exists");
    const design = await newDesign.save();
    indexShift("Design", design, { dec: false }, err => {
        if (err) return res.status(500).send(err);
        media = (Array.isArray(media) ? media : [media]).filter(e => e);
        design.images = [];
        if (!media.length) return res.send("Design saved");
        async.forEachOf(media, (file, i, cb) => {
            const photo_set = `design-${design.d_id}`;
            const photo_title = `${design.d_id}-web${i+1}`;
            photoUploader({ file, photo_title, photo_set, index: i+1 }, (err, photo) => {
                if (err) return cb(err.message || err);
                design.images.push({ photo_url: photo.photo_url, index: photo.index });
                cb();
            });
        }, err => {
            if (err) return res.status(500).send(err.message);
            design.save(() => res.send("Design saved"))
        });
    });
});

router.post('/design/sort-order', (req, res) => {
    const { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index }, err => {
        if (err) return res.status(500).send(err.message || err);
        res.send("Design set re-ordered")
    });
});

router.post('/design/edit', async (req, res) => {
    const { id, d_id, client, tools, description, link, hidden } = req.body;
    const filter = Object.assign({ _id: id }, d_id ? { d_id } : {});
    const doc = await Design.findOne(filter);
    if (!doc) return res.status(404).send("Design item not found");
    if (client) doc.text.client = client;
    if (tools) doc.text.tools = tools;
    if (description) doc.text.description = description;
    if (link) doc.link = link;
    doc.hidden = !!hidden;
    if (d_id && doc.d_id !== d_id) {
        Photo.updateMany({photo_set: `design-${doc.d_id}`}, {$set: {photo_set: `design-${d_id}`}}, (err, result) => {
            if (err) return res.status(500).send(err.message || "Error occurred whilst photos updating photo set");
            console.log(result);
            const { n, nModified } = result;
            const msg = n === nModified && nModified > 0 ? "" : ".\nNone or some of the d_id fields were modified";
            if (n === nModified && nModified > 0) doc.d_id = d_id;
            doc.save(err => res.send("Design collection updated" + msg));
        });
    } else { doc.save(err => res.send("Design collection updated")) }
});

router.post('/design/docs', (req, res) => Design.find((err, designs) => res.send(designs)));

module.exports = router;
