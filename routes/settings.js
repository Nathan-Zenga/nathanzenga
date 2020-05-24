const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cloud = require('cloudinary');
const async = require('async');
const { Photo, Design, Info_text, Admin } = require('../models/models');
const { indexShift, indexReorder, photoUploader } = require('../config/config');
const production = process.env.NODE_ENV === "production";

router.get('/---', (req, res) => {
    if (req.session.isAuthed || !production) {
        Photo.find().sort({photo_set: 1, index: 1}).exec((err, photos) => {
            Design.find().sort({index: 1}).exec((err, designs) => {
                Info_text.findOne((err, info) => {
                    res.render('settings', { title: "Settings", pagename: "settings", photos, designs, info })
                })
            })
        })
    } else {
        res.redirect("/settings/access");
    }
});

router.get('/access', (req, res) => {
    if (!req.session.isAuthed && production) {
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
    if (req.originalUrl !== "/settings/access" && req.session.isAuthed) req.session.cookie.maxAge = production ? 120000 : Infinity;
    next();
});

router.post('/access', (req, res) => {
    Admin.findOne((err, doc) => {
        bcrypt.compare(req.body.pass, doc.pass, (err, match) => {
            if (match) {
                req.session.cookie.maxAge = 120000; // 2 mins
                req.session.isAuthed = true;
            } else {
                req.session.flash_msg = "Invalid Password";
            }
            res.redirect("/settings/---");
        })
    })
});

router.post('/photo/upload', (req, res) => {
    var { photo_set, photo_url, index } = req.body;
    photoUploader(req.body, (err, photo) => {
        indexShift("Photo", photo, { dec: false }, () => {
            Design.findOne({ d_id: photo_set.replace("design-", "") }, (err2, design) => {
                if (!err2 && design) {
                    index = parseInt(index);
                    design.images.splice(index-1, 0, { photo_url, index });
                    for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
                    design.save();
                }
                if (err || err2) console.log(err || err2);
                res.send(err || err2 || "Photo saved");
            })
        })
    })
});

router.post('/photo/delete', (req, res) => {
    var { id } = req.body;
    if (!id) return res.send("Nothing selected");
    Photo.findByIdAndDelete(id, (err, photo) => {
        if (err || !photo) return res.send(err || "Photo not found");
        var { photo_set, photo_title, photo_url } = photo;
        var public_id = `${photo_set}/${photo_title}`.toLowerCase().replace(/[ ?&#\\%<>]/g, "_");
        cloud.v2.api.delete_resources([public_id], () => {
            Design.findOne({d_id: photo_set.replace("design-", "")}, (err, design) => {
                if (!err && design) {
                    design.images = design.images.filter(url => url !== photo_url);
                    for (let i = 0; i < design.images.length; i++) design.images[i].index = i+1;
                    design.save();
                }
                res.send("Photo deleted");
            })
        })
    })
});

router.post('/photo/set/delete', (req, res) => {
    var { photo_set } = req.body;
    if (!photo_set) return res.send("Nothing selected");
    Photo.deleteMany({ photo_set }, err => {
        cloud.v2.api.delete_resources_by_prefix(photo_set, err2 => {
            if (err || err2) return res.send(err || err2);
            Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec((err, covers) => {
                if (photo_set.includes("design-")) {
                    var d_id = photo_set.replace("design-", "");
                    Design.findOneAndDelete({ d_id }, (err, design) => {
                        if (err || !design) return res.send(err || d_id + " design set not found");
                        res.send(design.d_id + " design set deleted successfully");
                    })
                } else {
                    covers.forEach((cover, i) => {
                        if (cover.photo_set_index != i+1) {
                            cover.photo_set_index = i+1;
                            cover.save();
                        }
                    });
                    res.send(photo_set + " set deleted successfully")
                }
            })
        })
    })
});

router.post('/photo/set/sort-order', (req, res) => {
    var { photo_set, photo_set_index } = req.body;
    Photo.find({photo_set_cover: true}).sort({photo_set_index: 1}).exec((err, photo_set_reps) => {
        if (err) return console.error(err), res.send("Error occurred during query search"); 
        if (!photo_set_reps.length) return res.send("Photo set not found or doesn't exit");
        var sets = Object.assign([], photo_set_reps);
        var selected = sets.filter(p => p.photo_set === photo_set)[0];
        sets.splice(selected.photo_set_index-1, 1);
        sets.splice(parseInt(photo_set_index)-1, 0, selected);
        sets.forEach((set, i, a) => {
            set.photo_set_index = i+1;
            set.save(() => { if (i === a.length-1) res.send("Photo set cover reordered") })
        })
    })
});

router.post('/info-text/save', (req, res) => {
    Info_text.deleteMany({}, err => {
        var newInfo = new Info_text({ text: req.body.text });
        newInfo.save(err2 => {
            if (err || err2) console.log(err || err2);
            res.send(err || err2 || "Info text saved")
        });
    });
});

router.post('/design/save', (req, res) => {
    var { d_id, client, tools, description, link, index, images } = req.body;
    var newDesign = new Design({ d_id, text: { client, tools, description }, link, index });
    Design.findOne({ d_id: {$regex: new RegExp(d_id, "i")} }, (err, found) => {
        if (err || found) return res.send(err || "Design set already exists");
        indexShift("Design", newDesign, { dec: false }, err => {
            newDesign.save((err2, design) => {
                if (err || err2) res.send(err || err2);
                design.images = [];
                images = (Array.isArray(images) ? images : [images]).filter(e => e);
                async.forEachOf(images, (file, i, cb) => {
                    var photo_set = `design-${design.d_id}`;
                    var photo_title = `${design.d_id}-web${i ? "-" + (i+1) : ""}`;
                    var index = i+1;
                    photoUploader({ file, photo_title, photo_set, index }, (err, photo) => {
                        if (err) res.send(err);
                        design.images.push({ photo_url: photo.photo_url, index: photo.index });
                        if (i === images.length-1) design.save();
                        cb(err);
                    });
                }, err => { if (err) console.log(err); res.send(err || "Design saved") });
            });
        });
    })
});

// router.post('/design/delete', (req, res) => {
//     var { id } = req.body;
//     (Array.isArray(id) ? id : [id]).filter(e => e).forEach(id => {
//         Design.findByIdAndDelete(id, (err, design) => {
//             if (err) return console.error(err), res.send(err);
//             var { d_id } = design;
//             Photo.deleteMany({ photo_set: `design-${ d_id }` }, err => {
//                 if (err) return console.error(err), res.send(err);
//                 cloud.v2.api.delete_resources_by_prefix(`design-${ d_id }`, {}, err => {
//                     if (err) return console.error(err), res.send(err);
//                     res.send("Design deleted successfully");
//                 })
//             })
//         })
//     });
// });

router.post('/design/sort-order', (req, res) => {
    var { id, index } = req.body;
    indexReorder("Design", { id, newIndex: index }, err => { console.log(err || ""); res.send(err ? "Error occured" : "Design set re-ordered") });
});

router.post('/design/edit', (req, res) => {
    var { id, d_id, client, tools, description, link } = req.body;
    var msg = "";
    Design.findById(id, (err, doc) => {
        if (err) return console.error(err), res.send("Error occurred whilst fetching design doc");
        if (client) doc.text.client = client;
        if (tools) doc.text.tools = tools;
        if (description) doc.text.description = description;
        if (link) doc.link = link;
        if (d_id) {
            Photo.updateMany({photo_set: `design-${doc.d_id}`}, {$set: {photo_set: `design-${d_id}`}}, (err, result) => {
                if (err) return console.error(err), res.send("Error occurred whilst photos updating photo set");
                console.log(result);
                var { n, nModified } = result;
                if (n === nModified && nModified > 0) {
                    doc.d_id = d_id;
                } else {
                    msg = ".\nNone or some of the d_id fields were modified";
                }
                doc.save(err => res.send("Design collection updated" + msg));
            });
        } else { doc.save(err => res.send("Design collection updated")) }
    });
});

router.post('/design/docs', (req, res) => Design.find((err, designs) => res.send(designs)));

module.exports = router;
