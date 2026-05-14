const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  targetType: {
    type: String,
    enum: ['restaurant', 'foodItem'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, maxlength: 500 },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  images: [String],
  isVerified: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 }
}, { timestamps: true });

reviewSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('Review', reviewSchema);
