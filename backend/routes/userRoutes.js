const express = require('express');
const { getAccount, updateAccount, saveChartType, getChartType } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Uživatelské API
router.get('/account', authenticateToken, getAccount);
router.put('/account/update', authenticateToken, updateAccount);
router.post('/chart-type', authenticateToken, saveChartType);
router.get('/chart-type', authenticateToken, getChartType);

module.exports = router;
