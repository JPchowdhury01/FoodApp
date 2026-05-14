const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalRestaurants, totalOrders, totalFoodItems] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Restaurant.countDocuments({ isActive: true }),
      Order.countDocuments(),
      FoodItem.countDocuments({ isAvailable: true })
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$grandTotal' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalRestaurants,
          totalOrders,
          totalFoodItems,
          totalRevenue: revenueAgg[0]?.total || 0
        },
        recentOrders,
        ordersByStatus,
        monthlyRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
