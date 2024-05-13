const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
require('dotenv').config()
const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.use(session({
    secret: 'HareKrishna', // Add a secret key for session encryption
    resave: true,
    saveUninitialized: true
}));

passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'gender']
}, (accessToken, refreshToken, profile, cb) => {
    const userProfile = {
        id: profile.id,
        displayName: profile.displayName,
        gender: profile.gender
    };
    return cb(null, userProfile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

app.get('/profile', (req, res) => {
    res.json({ user: req.user });
});


// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
