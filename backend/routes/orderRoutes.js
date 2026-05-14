// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
