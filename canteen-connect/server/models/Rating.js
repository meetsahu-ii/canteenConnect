const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    menuItemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MenuItem', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    score: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },
    comment: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
