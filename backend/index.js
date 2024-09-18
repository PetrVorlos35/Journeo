const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Initialize environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Example route
app.get('/', (req, res) => {
  res.send('Journeo backend is running!');
});

// Endpoint for user login/registration
app.post('/api/login', (req, res) => {
  const { email, password } = req.body; // Get email and password from the request body

  // First, check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      // User already exists
      return res.status(400).json({ message: 'User already exists!' });
    }

    // If the user doesn't exist, insert a new user
    const insertUserQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(insertUserQuery, [email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error inserting user', error: err });
      }

      // Send success response
      res.status(200).json({ message: 'User registered successfully!' });
    });
  });
});


// Endpoint pro získání všech uživatelů
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';  // Předpokládáme, že máte tabulku `users`
    
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);  // Vraťte všechny uživatele jako JSON odpověď
    });
  });
  

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
