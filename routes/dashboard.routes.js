const express = require('express');
const { getDashboardSummary } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect); // Protect all dashboard routes

router.get('/summary', getDashboardSummary);

module.exports = router;
