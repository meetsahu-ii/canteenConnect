const CrowdData = require('../models/CrowdData');

// Report crowd data (called by Python AI script)
const reportCrowdData = async (req, res) => {
    try {
        const { personCount } = req.body;

        if (typeof personCount !== 'number' || personCount < 0) {
            return res.status(400).json({ message: 'Invalid person count' });
        }

        const crowdData = new CrowdData({
            personCount
        });

        await crowdData.save();

        console.log(`Crowd data reported: ${personCount} people`);

        res.status(201).json({
            message: 'Crowd data reported successfully',
            crowdData
        });
    } catch (error) {
        console.error('Report crowd data error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get latest crowd data
const getLatestCrowdData = async (req, res) => {
    try {
        const latestCrowdData = await CrowdData.findOne()
            .sort({ createdAt: -1 })
            .select('personCount createdAt');

        if (!latestCrowdData) {
            return res.status(404).json({ message: 'No crowd data available' });
        }

        // Determine crowd level based on person count
        let crowdLevel = 'Not Busy';
        let color = 'green';
        
        if (latestCrowdData.personCount > 50) {
            crowdLevel = 'Crowded';
            color = 'red';
        } else if (latestCrowdData.personCount > 25) {
            crowdLevel = 'Busy';
            color = 'yellow';
        }

        res.json({
            personCount: latestCrowdData.personCount,
            crowdLevel,
            color,
            timestamp: latestCrowdData.createdAt
        });
    } catch (error) {
        console.error('Get latest crowd data error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get crowd data history (optional, for analytics)
const getCrowdHistory = async (req, res) => {
    try {
        const { limit = 24 } = req.query; // Default to last 24 entries
        
        const crowdHistory = await CrowdData.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('personCount createdAt');

        res.json(crowdHistory);
    } catch (error) {
        console.error('Get crowd history error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    reportCrowdData,
    getLatestCrowdData,
    getCrowdHistory
};
