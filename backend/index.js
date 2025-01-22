const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes'); // Přidání uživatelských rout

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Přidání rout
app.use('/auth', authRoutes);
app.use('/', tripRoutes);
app.use('/', userRoutes); // Nové uživatelské routy

// Server start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
