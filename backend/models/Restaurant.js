const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cuisine: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-45 mins' },
  deliveryFee: { type: Number, default: 0 },
  minimumOrder: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  tags: [String],
  openingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
