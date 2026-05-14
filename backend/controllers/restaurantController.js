const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

exports.getAllRestaurants = async (req, res) => {
  try {
    const { search, city, cuisine, isOpen, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) query.name = { $regex: search, $options: 'i' };
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (isOpen !== undefined) query.isOpen = isOpen === 'true';

    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: restaurants, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const menu = await FoodItem.find({ restaurantId: req.params.id, isAvailable: true });
    const groupedMenu = menu.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({ success: true, data: { restaurant, menu: groupedMenu } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, message: 'Restaurant created!', data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.json({ success: true, message: 'Restaurant updated!', data: restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.json({ success: true, message: 'Restaurant deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
