const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for seeding...');

  await User.deleteMany();
  await Restaurant.deleteMany();
  await FoodItem.deleteMany();

  const admin = await User.create({
    name: 'Admin User', email: 'admin@foodapp.com', password: 'admin123', role: 'admin'
  });
  await User.create({
    name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user'
  });
  console.log('✅ Users seeded');

  const restaurants = await Restaurant.create([
    {
      name: 'Spice Garden', description: 'Authentic Indian cuisine with rich flavors',
      location: { address: '12 MG Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001' },
      cuisine: ['Indian', 'North Indian'], rating: 4.5, totalReviews: 120,
      deliveryTime: '25-35 mins', deliveryFee: 30, minimumOrder: 150,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      tags: ['popular', 'bestseller'], isOpen: true
    },
    {
      name: 'Burger Barn', description: 'Juicy burgers and crispy fries',
      location: { address: '45 Koramangala', city: 'Bengaluru', state: 'Karnataka', zipCode: '560034' },
      cuisine: ['Fast Food', 'American'], rating: 4.2, totalReviews: 89,
      deliveryTime: '20-30 mins', deliveryFee: 20, minimumOrder: 100,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      tags: ['fast-food', 'burgers'], isOpen: true
    },
    {
      name: 'Pizza Palace', description: 'Authentic Italian pizzas baked to perfection',
      location: { address: '78 Indiranagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560038' },
      cuisine: ['Italian', 'Pizza'], rating: 4.7, totalReviews: 203,
      deliveryTime: '30-40 mins', deliveryFee: 25, minimumOrder: 200,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      tags: ['pizza', 'trending'], isOpen: true
    }
  ]);
  console.log('✅ Restaurants seeded');

  await FoodItem.create([
    // Spice Garden
    { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 280, category: 'non-veg', restaurantId: restaurants[0]._id, rating: 4.6, isPopular: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300' },
    { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter and cream', price: 180, category: 'veg', restaurantId: restaurants[0]._id, rating: 4.4, isPopular: true, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=300' },
    { name: 'Garlic Naan', description: 'Soft leavened bread with garlic and butter', price: 60, category: 'breads', restaurantId: restaurants[0]._id, rating: 4.3, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300' },
    { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 320, category: 'non-veg', restaurantId: restaurants[0]._id, rating: 4.8, isBestSeller: true, image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300' },
    // Burger Barn
    { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce, tomato', price: 199, category: 'fast-food', restaurantId: restaurants[1]._id, rating: 4.3, isPopular: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
    { name: 'Veggie Burger', description: 'Grilled veggie patty with fresh greens', price: 149, category: 'veg', restaurantId: restaurants[1]._id, rating: 4.0, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300' },
    { name: 'Loaded Fries', description: 'Crispy fries loaded with cheese and jalapeños', price: 129, category: 'veg', restaurantId: restaurants[1]._id, rating: 4.4, isPopular: true, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300' },
    // Pizza Palace
    { name: 'Margherita Pizza', description: 'Classic tomato sauce with fresh mozzarella', price: 299, category: 'pizza', restaurantId: restaurants[2]._id, rating: 4.5, isPopular: true, isBestSeller: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
    { name: 'Pepperoni Pizza', description: 'Loaded with premium pepperoni slices', price: 399, category: 'pizza', restaurantId: restaurants[2]._id, rating: 4.7, isBestSeller: true, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
    { name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 149, category: 'dessert', restaurantId: restaurants[2]._id, rating: 4.6, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300' }
  ]);
  console.log('✅ Food items seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('Admin login: admin@foodapp.com / admin123');
  console.log('User login:  john@example.com / password123');
  mongoose.connection.close();
};

seed().catch(err => { console.error(err); process.exit(1); });
