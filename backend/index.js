const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const userRoutes = require('./routes/userRoutes'); // Přidání uživatelských rout
const friendsRoutes = require('./routes/friendsRoutes'); // Přidání rout pro přátele

require('./notificationService');

dotenv.config();

const app = express();
const corsOptions = {
  origin: `${process.env.APP_URL}`,
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
app.use('/', userRoutes);
app.use('/friends', friendsRoutes);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});



// Server start
const PORT = process.env.PORT || 5001;
const keepAlive = require('http').Server(app);
keepAlive.keepAliveTimeout = 60000; // Keep connections alive for 60 seconds

keepAlive.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
