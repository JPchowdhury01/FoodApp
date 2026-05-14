const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Verify items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      if (!foodItem || !foodItem.isAvailable) {
        return res.status(400).json({ success: false, message: `Item ${item.foodItem} is unavailable.` });
      }
      const itemTotal = foodItem.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        foodItem: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity,
        image: foodItem.image,
        customizations: item.customizations || []
      });
    }

    const deliveryFee = 30;
    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + taxes;

    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee,
      taxes,
      grandTotal,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash-on-delivery',
      specialInstructions,
      estimatedDeliveryTime: '30-45 mins',
      statusHistory: [{ status: 'pending', note: 'Order placed' }]
    });

    await order.populate('restaurantId', 'name location');
    res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Order.countDocuments({ userId: req.user._id });
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name image location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name image location phone')
      .populate('userId', 'name email phone');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only allow owner or admin
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    if (status === 'delivered') order.paymentStatus = 'paid';
    await order.save();

    res.json({ success: true, message: 'Order status updated!', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (['preparing', 'out-for-delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage.' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user' });
    await order.save();

    res.json({ success: true, message: 'Order cancelled.', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
