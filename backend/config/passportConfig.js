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
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const queryCheckUser = 'SELECT * FROM users WHERE email = ?';

      let retries = 3; // Number of retries in case of failure
      while (retries > 0) {
        try {
          db.query(queryCheckUser, [email], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
              const queryInsertUser = 'INSERT INTO users (email) VALUES (?)';
              db.query(queryInsertUser, [email], (err, result) => {
                if (err) throw err;
                return done(null, { id: result.insertId, email });
              });
            } else {
              return done(null, results[0]);
            }
          });
          break; // Exit loop if successful
        } catch (error) {
          console.error('Database error:', error);
          retries--;
          if (retries === 0) return done(error);
        }
      }
    }
  )
);


module.exports = passport;
