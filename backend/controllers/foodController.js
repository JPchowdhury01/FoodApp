const FoodItem = require('../models/FoodItem');

exports.getAllFoodItems = async (req, res) => {
  try {
    const { restaurantId, category, search, isPopular, page = 1, limit = 20 } = req.query;
    const query = { isAvailable: true };

    if (restaurantId) query.restaurantId = restaurantId;
    if (category) query.category = category;
    if (isPopular === 'true') query.isPopular = true;
    if (search) query.$text = { $search: search };

    const total = await FoodItem.countDocuments(query);
    const items = await FoodItem.find(query)
      .populate('restaurantId', 'name location rating deliveryTime')
      .sort({ isBestSeller: -1, rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFoodItemById = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate('restaurantId', 'name location rating');
    if (!item) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json({ success: true, message: 'Food item created!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.json({ success: true, message: 'Food item updated!', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Food item not found.' });
    res.json({ success: true, message: 'Food item deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await FoodItem.distinct('category');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
