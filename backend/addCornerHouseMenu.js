const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Restaurant = require("./models/Restaurant");
const FoodItem = require("./models/FoodItem");

const addFoodItem = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find Corner House restaurant
    const restaurant = await Restaurant.findOne({ name: "Corner House" });
    if (!restaurant) {
      console.error("❌ Corner House restaurant not found!");
      process.exit(1);
    }

    console.log("✅ Found restaurant:", restaurant.name);

    // Add food item
    const foodItem = await FoodItem.create({
      name: "Death by Chocolate",
      description:
        "Decadent chocolate dessert with layers of rich chocolate cake, chocolate mousse, and chocolate ganache",
      price: 350,
      category: "dessert",
      restaurantId: restaurant._id,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/7d/19/a1/caption.jpg?w=800&h=-1&s=1",
      isPopular: true,
      isBestSeller: true,
      isAvailable: true,
    });

    console.log("✅ Food item added successfully!");
    console.log("Food Item ID:", foodItem._id);
    console.log("Food Item Details:", foodItem);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

addFoodItem();
