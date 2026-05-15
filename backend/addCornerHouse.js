const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Restaurant = require("./models/Restaurant");

const addRestaurant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const restaurant = await Restaurant.create({
      name: "Corner House",
      description: "Premium desserts, ice creams, and confectionery delights",
      location: {
        address: "Jayanagar, Bangalore",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560041",
        coordinates: {
          lat: 12.9352,
          lng: 77.6245,
        },
      },
      cuisine: ["Desserts", "Ice Cream", "Bakery", "Cafe"],
      rating: 4.6,
      totalReviews: 0,
      deliveryTime: "15-25 mins",
      deliveryFee: 30,
      minimumOrder: 100,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e0ac?w=400",
      coverImage:
        "https://images.unsplash.com/photo-1563805042-7684c019e0ac?w=800",
      isOpen: true,
      isActive: true,
      tags: ["desserts", "ice-cream", "trending", "family-friendly"],
      openingHours: {
        open: "11:00",
        close: "23:30",
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
