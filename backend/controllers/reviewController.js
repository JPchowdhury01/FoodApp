const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

const updateTargetRating = async (targetId, targetType) => {
  const reviews = await Review.find({ targetId, targetType });
  const avgRating = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  const Model = targetType === 'restaurant' ? Restaurant : FoodItem;
  await Model.findByIdAndUpdate(targetId, { rating: avgRating.toFixed(1), totalReviews: reviews.length });
};

exports.createReview = async (req, res) => {
  try {
    const { targetId, targetType, rating, comment, orderId } = req.body;
    const existing = await Review.findOne({ userId: req.user._id, targetId, targetType });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this.' });

    const review = await Review.create({ userId: req.user._id, targetId, targetType, rating, comment, orderId });
    await updateTargetRating(targetId, targetType);
    await review.populate('userId', 'name avatar');

    res.status(201).json({ success: true, message: 'Review added!', data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { targetId, targetType, page = 1, limit = 10 } = req.query;
    const query = {};
    if (targetId) query.targetId = targetId;
    if (targetType) query.targetType = targetType;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: reviews, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const { targetId, targetType } = review;
    await review.deleteOne();
    await updateTargetRating(targetId, targetType);
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
