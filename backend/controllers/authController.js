const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');
const { sendEmail } = require('../notificationService');
const { createVerificationEmail } = require('../notificationService'); // Přidání této řádky


// Registrace uživatele
const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex'); // Unikátní token

  const queryCheckUser = 'SELECT * FROM users WHERE email = ?';
  db.query(queryCheckUser, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const queryInsertUser = 'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)';
    db.query(queryInsertUser, [email, hashedPassword, verificationToken], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const verificationLink = `${process.env.API_URL}/auth/verify-email?token=${verificationToken}`;

      // Odeslání ověřovacího e-mailu
      const verificationEmail = createVerificationEmail(verificationLink);
      sendEmail(email, 'Ověření e-mailu', verificationEmail);
      
      res.status(201).json({ message: 'User registered! Check your email for verification.' });
    });
  });
};

const verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('<h1>Neplatný ověřovací odkaz.</h1>');
  }

  const queryFindUser = 'SELECT * FROM users WHERE verification_token = ?';
  db.query(queryFindUser, [token], (err, results) => {
    if (err) return res.status(500).send('<h1>Chyba serveru. Zkus to znovu později.</h1>');
    if (results.length === 0) return res.status(400).send('<h1>Neplatný nebo vypršelý token.</h1>');

    const queryUpdateUser = 'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?';
    db.query(queryUpdateUser, [token], (err) => {
      if (err) return res.status(500).send('<h1>Chyba při ověřování e-mailu.</h1>');

      // Přesměrování na login po 2 sekundách
      res.send(`
        <html>
        <head>
          <script>
            setTimeout(() => {
              window.location.href = "${process.env.APP_URL}/login";
            }, 2000);
          </script>
        </head>
        <body style="text-align:center; font-family:Arial;">
          <h1>E-mail úspěšně ověřen! ✅</h1>
          <p>Přesměrovávám na přihlášení...</p>
        </body>
        </html>
      `);
    });
  });
};



// Přihlášení uživatele
const login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];

    if (!user.is_verified) return res.status(403).json({ message: 'Email not verified. Check your inbox.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  });
};


const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });

    const newToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ token: newToken });
  });
};


// Google OAuth callback
const googleOAuth = async (req, res) => {
  try {
    if (!req.user) throw new Error('User not found');

    const user = req.user;
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' });

    console.log("OAuth successful, redirecting...");

    setTimeout(() => {
      res.redirect(`${process.env.APP_URL}/dashboard?token=${token}`);
    }, 2000); // Delay redirect by 2 seconds
  } catch (error) {
    console.error('Google OAuth error:', error.message);
    res.redirect(`${process.env.APP_URL}/login?error=auth_failed`);
  }
};



module.exports = { register, login, googleOAuth, refreshToken, verifyEmail };
