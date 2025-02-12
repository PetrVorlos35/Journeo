const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Registrace uživatele
const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const queryCheckUser = 'SELECT * FROM users WHERE email = ?';
  db.query(queryCheckUser, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const queryInsertUser = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(queryInsertUser, [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'User registered successfully!', token });
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });

    const newToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: newToken });
  });
};


// Google OAuth callback
const googleOAuth = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`${process.env.APP_URL}/dashboard?token=${token}`); 
};

module.exports = { register, login, googleOAuth, refreshToken };
