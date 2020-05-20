const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cloud = require('cloudinary');
const { Photo, Design, Info_text, Admin } = require('../models/models');
const { indexShift, indexReorder, photoUploader } = require('../config/config');

router.get('/---', (req, res) => {
    if (req.session.isAuthed) {
        Photo.find().sort({index: 1}).exec((err, photos) => {
            Design.find().sort({index: 1}).exec((err, designs) => {
                Info_text.findOne((err, info) => {
                    res.render('settings', { title: "Settings", pagename: "settings", docs: { photos, designs, info } })
                })
            })
        })
    } else {
        res.redirect("/settings/access");
    }
});

router.get('/access', (req, res) => {
    if (!req.session.isAuthed) {
        var flash_msg = req.session.flash_msg;
        res.render('access', { title: "Password Required", pagename: "access", flash_msg }, (err, html) => {
            req.session.flash_msg = undefined;
            res.send(html);
        })
    } else {
        res.redirect("/settings/---")
    }
});

router.post('/*', (req, res, next) => {
    if (req.originalUrl !== "/settings/access" && req.session.isAuthed) req.session.cookie.maxAge = 120000;
    next();
});

router.post('/access', (req, res) => {
    Admin.findOne((err, doc) => {
        bcrypt.compare(req.body.pass, doc.pass, (err, match) => {
            if (match) {
                req.session.cookie.maxAge = 120000;
                req.session.isAuthed = true;
            } else {
                req.session.flash_msg = "Invalid Password";
            }
            res.redirect("/settings/---");
        })
    })
});

router.post('/photo/upload', (req, res) => { photoUploader(req.body, err => {
    res.send(err || "Photo saved");
})});

router.post('/photo/delete', (req, res) => {
    var ids = Object.values(req.body);
    if (!ids.length) return res.send("Nothing selected");
    ids.forEach((id, i, arr) => {
        Photo.findByIdAndDelete(id, (err, photo) => {
            var {photo_set, photo_title} = photo || {};
            var public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
            cloud.v2.api.delete_resources([public_id], {}, () => {
                Design.findOne({d_id: photo_set.replace("design-", "")}, (err, design) => {
                    if (!err && design) {
                        design.images = design.images.filter(d => d);
                        design.images.forEach((img, i) => img.index = (i+1));
                        design.save();
                    }
                    if (i === arr.length-1) res.send(`Photo${arr.length > 1 ? "s" : ""} deleted`);
                })
            })
        })
    })
});

router.post('/photo/set/delete', (req, res) => {
    var { set } = req.body;
    if (!set) return res.send("Nothing selected");
    Photo.deleteMany({ photo_set: set }, err => {
        cloud.v2.api.delete_resources_by_prefix(set, {}, err2 => {
            if (err || err2) return res.send(err || err2);
            res.send("Photo deleted successfully");
        })
    })
});

router.post('/photo/set/reorder', (req, res) => {
    var { gallery_to_reorder, index } = req.body;
    indexReorder("gallery", gallery_to_reorder, index, () => res.send("Photo re-ordered"));
});

router.post('/info-text/save', (req, res) => {
    Info_text.deleteMany({}, err => {
        var newInfo = new Info_text({ text: req.body.text });
        newInfo.save(err => err ? res.send(err) : res.redirect(req.get("referrer")));
    });
});

router.post('/design/save', (req, res) => {
    var { d_id, client, tools, description, link, index, images } = req.body;
    var newDesign = new Design({ d_id, text: { client, tools, description }, link, index });
    indexShift("Design", newDesign, {dec: false}, () => {
        newDesign.save((err, design) => {
            try {
                if (err) throw err;
                design.images = [];
                JSON.parse(images).forEach((image, i, arr) => {
                    var { file, photo_title } = image;
                    photoUploader({ file, photo_title, photo_set: `design-${design.d_id}`, index: i+1 }, (err, photo) => {
                        if (err) throw err;
                        design.images.push({ photo_url: photo.photo_url, index: photo.index });
                        if (i === arr.length-1) design.save(() => res.send("Design saved"));
                    });
                });
            } catch(e) { console.log(e); res.send("Design saved, but error occured") }
        });
    });
});

router.post('/design/delete', (req, res) => {
    var { id } = req.body;
    (Array.isArray(id) ? id : [id]).filter(e => e).forEach(id => {
        Design.findByIdAndDelete(id, (err, design) => {
            if (err) return res.send(err);
            var { d_id } = design;
            Photo.deleteMany({ photo_set: `design-${ d_id }` }, err => {
                if (err) return res.send(err);
                cloud.v2.api.delete_resources_by_prefix(`design-${ d_id }`, {}, err => {
                    if (err) return res.send(err);
                    res.send("Design deleted successfully");
                })
            })
        })
    });
});

router.post('/design/reorder', (req, res) => {
    var {design_to_reorder, index} = req.body;
    indexReorder("design", design_to_reorder, index, () => res.redirect(req.get("referrer")));
});

router.post('/design/edit', (req, res) => {
    var { design_to_edit, d_id, client, tools, description, link } = req.body;
    Design.findById(design_to_edit, (err, doc) => {
        doc.text.client = client || doc.text.client;
        doc.text.tools = tools || doc.text.tools;
        doc.text.description = description || doc.text.description;
        doc.link = link || doc.link;
        if (d_id) {
            Photo.updateMany({photo_set: `design-${doc.d_id}`}, {photo_set: `design-${d_id}`}, (err, result) => {
                if (err) return console.error(err), res.send("Error occurred whilst photos updating photo set");
                console.log(result);
                if (result.n > 0) doc.d_id = d_id;
            });
        }
        doc.save(err => res.send("Design collection updated"));
    });
});

router.post('/design/documents', (req, res) => { Design.find((err, docs) => res.send(docs)) });

module.exports = router;
