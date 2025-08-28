const MenuItem = require('../models/MenuItem');
const Rating = require('../models/Rating');

// Get all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.json(menuItems);
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new menu item (admin only)
const addMenuItem = async (req, res) => {
    try {
        const { name, price, description, category, imageUrl } = req.body;
        
        const menuItem = new MenuItem({
            name,
            price,
            description,
            category,
            imageUrl: imageUrl || ''
        });

        await menuItem.save();
        res.status(201).json({
            message: 'Menu item added successfully',
            menuItem
        });
    } catch (error) {
        console.error('Add menu item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update menu item (admin only)
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({
            message: 'Menu item updated successfully',
            menuItem
        });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete menu item (admin only)
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const menuItem = await MenuItem.findByIdAndDelete(id);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Also delete associated ratings
        await Rating.deleteMany({ menuItemId: id });

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add rating to menu item
const addRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, comment } = req.body;
        const userId = req.user._id;

        // Check if menu item exists
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Check if user already rated this item
        const existingRating = await Rating.findOne({ menuItemId: id, userId });
        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this item' });
        }

        // Create new rating
        const rating = new Rating({
            menuItemId: id,
            userId,
            score,
            comment
        });

        await rating.save();

        // Update average rating
        const allRatings = await Rating.find({ menuItemId: id });
        const totalScore = allRatings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = totalScore / allRatings.length;

        await MenuItem.findByIdAndUpdate(id, { averageRating });

        res.status(201).json({
            message: 'Rating added successfully',
            rating,
            newAverageRating: averageRating
        });
    } catch (error) {
        console.error('Add rating error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addRating
};
