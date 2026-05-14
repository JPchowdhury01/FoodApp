const express = require('express');
const router = express.Router();
const { getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, adminOnly, createRestaurant);
router.put('/:id', protect, adminOnly, updateRestaurant);
router.delete('/:id', protect, adminOnly, deleteRestaurant);

module.exports = router;
