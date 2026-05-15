const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Restaurant = require("./models/Restaurant");

const removeDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all restaurants
    const allRestaurants = await Restaurant.find().sort({ createdAt: 1 });
    console.log(
      `📊 Total restaurants before cleanup: ${allRestaurants.length}`,
    );

    // Group by name and find duplicates
    const nameMap = {};
    const duplicates = [];

    allRestaurants.forEach((restaurant) => {
      if (nameMap[restaurant.name]) {
        // This is a duplicate
        duplicates.push({
          id: restaurant._id,
          name: restaurant.name,
          createdAt: restaurant.createdAt,
        });
      } else {
        // First occurrence, keep it
        nameMap[restaurant.name] = restaurant._id;
      }
    });

    if (duplicates.length === 0) {
      console.log("✅ No duplicate restaurants found!");
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`\n⚠️  Found ${duplicates.length} duplicate restaurant(s):`);
    duplicates.forEach((dup) => {
      console.log(`  - ${dup.name} (ID: ${dup.id})`);
    });

    // Delete duplicates
    const duplicateIds = duplicates.map((dup) => dup.id);
    const result = await Restaurant.deleteMany({ _id: { $in: duplicateIds } });

    console.log(`\n🗑️  Deleted ${result.deletedCount} duplicate restaurant(s)`);

    // Get final count
    const finalCount = await Restaurant.countDocuments();
    console.log(`✅ Total restaurants after cleanup: ${finalCount}`);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

removeDuplicates();
