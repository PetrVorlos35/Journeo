const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your frontend's origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

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

// Passport Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
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

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  const user = req.user;

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Redirect to frontend and pass the token as a query parameter
  res.redirect(`http://localhost:5173/dashboard?token=${token}`);
});

// Register route
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const queryCheckUser = 'SELECT * FROM users WHERE email = ?';
  db.query(queryCheckUser, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

    const queryInsertUser = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(queryInsertUser, [email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ message: 'User registered successfully!', token });
    });
  });
});

// Login route
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

app.put('/account/update', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { jmeno, prijmeni, prezdivka, profilovka } = req.body;
    
    const query = 'UPDATE users SET jmeno = ?, prijmeni = ?, prezdivka = ?, profilovka = ? WHERE email = ?';
    db.query(query, [jmeno, prijmeni, prezdivka, profilovka, decoded.email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated successfully' });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});



app.get('/account', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [decoded.email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = results[0];
      res.json({
        id: user.id,
        email: user.email,
        jmeno: user.jmeno,
        prijmeni: user.prijmeni,
        prezdivka: user.prezdivka,
        profilovka: user.profilovka,
        created_at: user.created_at
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Endpoint to create a new trip with user association
app.post('/trips', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    

    const { userId, title, startDate, endDate, activities } = req.body;
    const query = 'INSERT INTO trips (user_id, title, start_date, end_date, activities) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [userId, title, startDate, endDate, JSON.stringify(activities)], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Trip created successfully', tripId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/updateActivities', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { tripId, activities } = req.body;
    const query = 'UPDATE trips SET activities = ? WHERE id = ?';
    db.query(query, [JSON.stringify(activities), tripId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Activities updated successfully' });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/getActivities', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tripId = req.query.tripId;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip ID is missing' }); // Add clear error message
    }

    const query = 'SELECT activities FROM trips WHERE id = ?';
    db.query(query, [tripId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0 || !results[0].activities) {
        return res.json({ activities: null });
      }

      const activities = JSON.parse(results[0].activities);
      res.json({ activities });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
});




app.get('/getTrips', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = req.query.id;

    const query = 'SELECT * FROM trips WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
})

app.delete('/deleteTrip', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = req.query.id;
    const query = 'DELETE FROM trips WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Trip deleted successfully' });
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
})




// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
