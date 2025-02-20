const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const queryCheckUser = 'SELECT * FROM users WHERE email = ?';

      db.query(queryCheckUser, [email], (err, results) => {
        if (err) return done(err);

        if (results.length === 0) {
          const queryInsertUser = 'INSERT INTO users (email) VALUES (?)';
          db.query(queryInsertUser, [email], (err, result) => {
            if (err) return done(err);
            return done(null, { id: result.insertId, email });
          });
        } else {
          return done(null, results[0]);
        }
      });
    }
  )
);

module.exports = passport;
