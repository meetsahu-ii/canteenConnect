const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    category: { 
        type: String, 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    averageRating: { 
        type: Number, 
        default: 0 
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
