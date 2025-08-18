const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', protect, getDashboardData);

module.exports = router;
// This route handles fetching the dashboard data for the authenticated user.
// It uses the `protect` middleware to ensure that only authenticated users can access it.