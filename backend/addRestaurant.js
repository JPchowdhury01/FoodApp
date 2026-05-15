const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Restaurant = require("./models/Restaurant");

const addRestaurant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const restaurant = await Restaurant.create({
      name: "Bathinda Junction",
      description: "North Indian cuisine with authentic flavors from Punjab",
      location: {
        address: "Main Market, Bathinda",
        city: "Bathinda",
        state: "Punjab",
        zipCode: "151001",
        coordinates: {
          lat: 30.215,
          lng: 74.9497,
        },
      },
      cuisine: ["Punjabi", "North Indian", "Chinese"],
      rating: 4.3,
      totalReviews: 0,
      deliveryTime: "25-35 mins",
      deliveryFee: 40,
      minimumOrder: 150,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      coverImage:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      isOpen: true,
      isActive: true,
      tags: ["popular", "local-favorite", "punjabi-cuisine"],
      openingHours: {
        open: "10:00",
        close: "23:00",
      },
    });

    console.log("✅ Restaurant added successfully!");
    console.log("Restaurant ID:", restaurant._id);
    console.log("Restaurant Details:", restaurant);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

addRestaurant();
