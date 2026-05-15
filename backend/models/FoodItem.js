const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  description: { type: String, default: '' },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: { type: String, default: '' },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Veg', 'Non-veg', 'Vegan', 'Fast-food', 'Desserts', 'Beverages','Breads', 'Rice', 'Noodles', 'Pizza', 'Burgers', 'Seafood','Sushi','Soup','Biryani','Sides','Tacos','Quesadilla','Bowls','Curry','Shawarma','Kebab','Pasta','Starters','Main Course','Cakes','BBQ','Salads','Momos','Steak','Chai','Snacks','Wafffles']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  preparationTime: { type: String, default: '15-20 mins' },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  customizations: [{
    name: String,
    options: [{ label: String, price: Number }]
  }],
  tags: [String]
}, { timestamps: true });

foodItemSchema.index({ restaurantId: 1, category: 1 });
foodItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
