const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const {
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addRating
} = require('../controllers/menuController');

// GET /api/menu - Get all menu items (public)
router.get('/', getAllMenuItems);

// POST /api/menu - Add new menu item (admin only)
router.post('/', authenticateToken, isAdmin, addMenuItem);

// PUT /api/menu/:id - Update menu item (admin only)
router.put('/:id', authenticateToken, isAdmin, updateMenuItem);

// DELETE /api/menu/:id - Delete menu item (admin only)
router.delete('/:id', authenticateToken, isAdmin, deleteMenuItem);

// POST /api/menu/:id/rate - Add rating to menu item (authenticated users)
router.post('/:id/rate', authenticateToken, addRating);

module.exports = router;
