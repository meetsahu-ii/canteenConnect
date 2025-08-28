const mongoose = require('mongoose');

const crowdDataSchema = new mongoose.Schema({
    personCount: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('CrowdData', crowdDataSchema);
