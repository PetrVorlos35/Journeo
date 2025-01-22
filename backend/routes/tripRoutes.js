const express = require('express');
const {
  createTrip,
  updateActivities,
  getActivities,
  overviewTrip,
  getTrips,
  deleteTrip,
  getBudget
} = require('../controllers/tripController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Chráněné API pro výlety
router.post('/trips', authenticateToken, createTrip);
router.post('/updateActivities', authenticateToken, updateActivities);
router.get('/getActivities', authenticateToken, getActivities);
router.get('/overviewTrip', authenticateToken, overviewTrip);
router.get('/getTrips', authenticateToken, getTrips);
router.delete('/deleteTrip', authenticateToken, deleteTrip);
router.get('/budget', authenticateToken, getBudget);

module.exports = router;
