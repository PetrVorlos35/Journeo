const express = require('express');
const passport = require('../config/passportConfig');
const { register, login, googleOAuth } = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware'); // Import middleware

const router = express.Router();

// API routes
router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), googleOAuth);

// Chráněná routa – pouze pro přihlášené uživatele
router.get('/me', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

module.exports = router;
