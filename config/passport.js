const { Strategy } = require('passport-local');
const { Admin } = require('../models/models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { openConnection, closeConnection } = require('../services/dbConnect');

passport.use("admin-login", new Strategy(async (username, password, done) => {
    try {
        await openConnection();
        const user = await Admin.findOne();
        const match = await bcrypt.compare(password, (user || {}).pass || "");
        if (!user || !match) return done(null, null, { message: "Invalid password, or the admin is not registered" });
        done(null, user);
    } catch (err) { done(err) }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Admin.findById(id);
        await closeConnection();
        done(null, user)
    } catch (err) { done(err) }
});

module.exports = passport;
