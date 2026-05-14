const express = require('express');
const router = express.Router();
const { getAllFoodItems, getFoodItemById, createFoodItem, updateFoodItem, deleteFoodItem, getCategories } = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.get('/', getAllFoodItems);
router.get('/:id', getFoodItemById);
router.post('/', protect, adminOnly, createFoodItem);
router.put('/:id', protect, adminOnly, updateFoodItem);
router.delete('/:id', protect, adminOnly, deleteFoodItem);

module.exports = router;
