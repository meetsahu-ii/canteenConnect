const express = require('express');
const router = express.Router();
const {
    reportCrowdData,
    getLatestCrowdData,
    getCrowdHistory
} = require('../controllers/crowdController');

// POST /api/crowd/report - Report crowd data (called by Python AI script)
router.post('/report', reportCrowdData);

// GET /api/crowd/latest - Get latest crowd data
router.get('/latest', getLatestCrowdData);

// GET /api/crowd/history - Get crowd data history (optional)
router.get('/history', getCrowdHistory);

module.exports = router;
