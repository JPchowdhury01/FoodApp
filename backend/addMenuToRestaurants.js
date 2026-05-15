const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Restaurant = require("./models/Restaurant");
const FoodItem = require("./models/FoodItem");

const menuItems = {
  "Spice Garden": [
    {
      name: "Chicken Tikka Masala",
      price: 320,
      category: "Curry",
      description: "Tender chicken in creamy tomato sauce",
    },
    {
      name: "Butter Naan",
      price: 80,
      category: "Breads",
      description: "Soft buttered Indian bread",
    },
    {
      name: "Biryani Rice",
      price: 280,
      category: "Rice",
      description: "Fragrant basmati rice with spices",
    },
    {
      name: "Paneer Dosa",
      price: 180,
      category: "Starter",
      description: "Crispy pancake with cottage cheese",
    },
    {
      name: "Mango Lassi",
      price: 120,
      category: "Beverages",
      description: "Refreshing yogurt drink",
    },
  ],
  "Burger Barn": [
    {
      name: "Classic Cheeseburger",
      price: 280,
      category: "Burgers",
      description: "Double patty with melted cheese",
    },
    {
      name: "French Fries",
      price: 120,
      category: "Sides",
      description: "Crispy golden fries",
    },
    {
      name: "Bacon BBQ Burger",
      price: 350,
      category: "Burgers",
      description: "Smoky BBQ with crispy bacon",
    },
    {
      name: "Fried Chicken Sandwich",
      price: 250,
      category: "Sandwiches",
      description: "Juicy fried chicken breast",
    },
    {
      name: "Milkshake Chocolate",
      price: 150,
      category: "Beverages",
      description: "Creamy chocolate shake",
    },
  ],
  "Pizza Palace": [
    {
      name: "Margherita Pizza",
      price: 380,
      category: "Pizza",
      description: "Fresh mozzarella and basil",
    },
    {
      name: "Pepperoni Pizza",
      price: 420,
      category: "Pizza",
      description: "Classic pepperoni delight",
    },
    {
      name: "Veggie Supreme",
      price: 400,
      category: "Pizza",
      description: "Mixed vegetables pizza",
    },
    {
      name: "Garlic Bread",
      price: 150,
      category: "Starters",
      description: "Crispy garlic bread",
    },
    {
      name: "Caesar Salad",
      price: 200,
      category: "Salads",
      description: "Fresh romaine with parmesan",
    },
  ],
  "Sushi Master": [
    {
      name: "California Roll",
      price: 380,
      category: "Sushi",
      description: "Avocado, cucumber, imitation crab",
    },
    {
      name: "Spicy Tuna Roll",
      price: 420,
      category: "Sushi",
      description: "Fresh tuna with spicy mayo",
    },
    {
      name: "Dragon Roll",
      price: 500,
      category: "Sushi",
      description: "Eel and avocado combination",
    },
    {
      name: "Miso Soup",
      price: 150,
      category: "Soup",
      description: "Traditional miso broth",
    },
    {
      name: "Edamame",
      price: 120,
      category: "Starters",
      description: "Steamed soybeans",
    },
  ],
  "Biryani Express": [
    {
      name: "Hyderabadi Biryani",
      price: 380,
      category: "Biryani",
      description: "Fragrant Hyderabadi style rice",
    },
    {
      name: "Chicken Biryani",
      price: 320,
      category: "Biryani",
      description: "Tender chicken with spices",
    },
    {
      name: "Mutton Biryani",
      price: 420,
      category: "Biryani",
      description: "Slow-cooked mutton",
    },
    {
      name: "Raita",
      price: 100,
      category: "Sides",
      description: "Yogurt side dish",
    },
    {
      name: "Gulab Jamun",
      price: 120,
      category: "Desserts",
      description: "Sweet milk dumplings",
    },
  ],
  "Taco Fiesta": [
    {
      name: "Carne Asada Tacos",
      price: 280,
      category: "Tacos",
      description: "Grilled marinated beef",
    },
    {
      name: "Fish Tacos",
      price: 300,
      category: "Tacos",
      description: "Fresh battered fish",
    },
    {
      name: "Chicken Quesadilla",
      price: 250,
      category: "Quesadilla",
      description: "Cheese and chicken",
    },
    {
      name: "Salsa & Chips",
      price: 120,
      category: "Starters",
      description: "Crispy chips with salsa",
    },
    {
      name: "Churros",
      price: 150,
      category: "Desserts",
      description: "Fried pastry with chocolate",
    },
  ],
  "Vegan Paradise": [
    {
      name: "Vegan Buddha Bowl",
      price: 280,
      category: "Bowls",
      description: "Quinoa, veggies, tahini dressing",
    },
    {
      name: "Chickpea Curry",
      price: 250,
      category: "Curry",
      description: "Spiced chickpeas in tomato",
    },
    {
      name: "Veggie Burger",
      price: 220,
      category: "Burgers",
      description: "Plant-based patty",
    },
    {
      name: "Avocado Toast",
      price: 180,
      category: "Breakfast",
      description: "Whole grain with avocado",
    },
    {
      name: "Smoothie Bowl",
      price: 200,
      category: "Breakfast",
      description: "Berry smoothie with toppings",
    },
  ],
  "Thai Orchid": [
    {
      name: "Pad Thai",
      price: 280,
      category: "Noodles",
      description: "Stir-fried rice noodles",
    },
    {
      name: "Green Curry",
      price: 300,
      category: "Curry",
      description: "Coconut green curry",
    },
    {
      name: "Tom Yum Soup",
      price: 200,
      category: "Soup",
      description: "Spicy Thai soup",
    },
    {
      name: "Spring Rolls",
      price: 150,
      category: "Starters",
      description: "Crispy spring rolls",
    },
    {
      name: "Mango Sticky Rice",
      price: 180,
      category: "Desserts",
      description: "Sweet mango dessert",
    },
  ],
  "Kebab House": [
    {
      name: "Chicken Shawarma",
      price: 280,
      category: "Shawarma",
      description: "Spiced rotisserie chicken",
    },
    {
      name: "Lamb Kebab",
      price: 350,
      category: "Kebab",
      description: "Grilled lamb skewers",
    },
    {
      name: "Falafel Wrap",
      price: 200,
      category: "Wraps",
      description: "Crispy falafel in pita",
    },
    {
      name: "Hummus Plate",
      price: 150,
      category: "Starters",
      description: "Chickpea dip with bread",
    },
    {
      name: "Baklava",
      price: 120,
      category: "Desserts",
      description: "Honey phyllo pastry",
    },
  ],
  "Pasta Grill": [
    {
      name: "Fettuccine Alfredo",
      price: 320,
      category: "Pasta",
      description: "Creamy alfredo sauce",
    },
    {
      name: "Spaghetti Carbonara",
      price: 340,
      category: "Pasta",
      description: "Bacon and egg pasta",
    },
    {
      name: "Lasagna",
      price: 380,
      category: "Pasta",
      description: "Layered meat and cheese",
    },
    {
      name: "Garlic Bread",
      price: 120,
      category: "Starters",
      description: "Toasted garlic bread",
    },
    {
      name: "Tiramisu",
      price: 150,
      category: "Desserts",
      description: "Italian layered dessert",
    },
  ],
  "Dragon Wok": [
    {
      name: "Chicken Manchurian",
      price: 280,
      category: "Main Course",
      description: "Sweet and spicy chicken",
    },
    {
      name: "Chow Mein",
      price: 250,
      category: "Noodles",
      description: "Stir-fried noodles",
    },
    {
      name: "Fried Rice",
      price: 220,
      category: "Rice",
      description: "Egg fried rice with veggies",
    },
    {
      name: "Spring Rolls",
      price: 150,
      category: "Starters",
      description: "Crispy rolls",
    },
    {
      name: "Momos",
      price: 180,
      category: "Starters",
      description: "Steamed dumplings",
    },
  ],
  "Choco Bliss": [
    {
      name: "Chocolate Cake",
      price: 280,
      category: "Cakes",
      description: "Rich chocolate cake",
    },
    {
      name: "Brownie Sundae",
      price: 250,
      category: "Desserts",
      description: "Brownie with ice cream",
    },
    {
      name: "Chocolate Mousse",
      price: 200,
      category: "Mousse",
      description: "Fluffy chocolate mousse",
    },
    {
      name: "Macarons",
      price: 120,
      category: "Pastries",
      description: "French almond cookies",
    },
    {
      name: "Hot Chocolate",
      price: 150,
      category: "Beverages",
      description: "Creamy hot chocolate",
    },
  ],
  "Tandoori Nights": [
    {
      name: "Tandoori Chicken",
      price: 320,
      category: "Main Course",
      description: "Spiced roasted chicken",
    },
    {
      name: "Paneer Tikka",
      price: 280,
      category: "Starters",
      description: "Grilled cottage cheese",
    },
    {
      name: "Tandoori Naan",
      price: 100,
      category: "Breads",
      description: "Baked in tandoor",
    },
    {
      name: "Seekh Kebab",
      price: 300,
      category: "Kebab",
      description: "Minced meat skewers",
    },
    {
      name: "Kulfi",
      price: 80,
      category: "Desserts",
      description: "Traditional frozen dessert",
    },
  ],
  "BBQ Smokehouse": [
    {
      name: "Smoked Ribs",
      price: 420,
      category: "BBQ",
      description: "Slow smoked ribs",
    },
    {
      name: "Brisket",
      price: 480,
      category: "BBQ",
      description: "Tender smoked brisket",
    },
    {
      name: "BBQ Chicken",
      price: 350,
      category: "BBQ",
      description: "Grilled BBQ chicken",
    },
    {
      name: "Cornbread",
      price: 100,
      category: "Sides",
      description: "Sweet cornbread",
    },
    {
      name: "Coleslaw",
      price: 120,
      category: "Sides",
      description: "Creamy cabbage slaw",
    },
  ],
  "Fusion Kitchen": [
    {
      name: "Paneer Tikka Burger",
      price: 300,
      category: "Burgers",
      description: "Indian meets American",
    },
    {
      name: "Thai Basil Pasta",
      price: 340,
      category: "Pasta",
      description: "Thai spiced pasta",
    },
    {
      name: "Korean Tacos",
      price: 320,
      category: "Tacos",
      description: "Korean BBQ tacos",
    },
    {
      name: "Miso Butter Naan",
      price: 150,
      category: "Breads",
      description: "Fusion flatbread",
    },
    {
      name: "Matcha Cheesecake",
      price: 180,
      category: "Desserts",
      description: "Green tea cheesecake",
    },
  ],
  "Soup Station": [
    {
      name: "Tomato Basil Soup",
      price: 180,
      category: "Soup",
      description: "Fresh tomato soup",
    },
    {
      name: "Chicken & Vegetable",
      price: 220,
      category: "Soup",
      description: "Hearty chicken soup",
    },
    {
      name: "Caesar Salad",
      price: 200,
      category: "Salads",
      description: "Classic Caesar",
    },
    {
      name: "Greek Salad",
      price: 210,
      category: "Salads",
      description: "Fresh Greek vegetables",
    },
    {
      name: "Smoothie Bowl",
      price: 200,
      category: "Bowls",
      description: "Acai with granola",
    },
  ],
  "Momos Corner": [
    {
      name: "Chicken Momos",
      price: 180,
      category: "Momos",
      description: "Steamed chicken dumplings",
    },
    {
      name: "Vegetable Momos",
      price: 150,
      category: "Momos",
      description: "Steamed veggie dumplings",
    },
    {
      name: "Buff Momos",
      price: 200,
      category: "Momos",
      description: "Buff meat momos",
    },
    {
      name: "Momo Soup",
      price: 200,
      category: "Soup",
      description: "Momos in broth",
    },
    {
      name: "Chow Mein",
      price: 180,
      category: "Noodles",
      description: "Pan-fried noodles",
    },
  ],
  "Grilled Perfection": [
    {
      name: "Ribeye Steak",
      price: 580,
      category: "Steak",
      description: "Premium ribeye",
    },
    {
      name: "Filet Mignon",
      price: 680,
      category: "Steak",
      description: "Tender filet mignon",
    },
    {
      name: "NY Strip",
      price: 520,
      category: "Steak",
      description: "Classic New York strip",
    },
    {
      name: "Grilled Salmon",
      price: 450,
      category: "Fish",
      description: "Fresh grilled salmon",
    },
    {
      name: "Lobster Tail",
      price: 580,
      category: "Seafood",
      description: "Grilled lobster tail",
    },
  ],
  "Chai Express": [
    {
      name: "Masala Chai",
      price: 80,
      category: "Chai",
      description: "Traditional spiced tea",
    },
    {
      name: "Ginger Chai",
      price: 90,
      category: "Chai",
      description: "Ginger infused tea",
    },
    {
      name: "Samosa",
      price: 60,
      category: "Snacks",
      description: "Crispy triangle snack",
    },
    {
      name: "Pakora",
      price: 80,
      category: "Snacks",
      description: "Vegetable fritters",
    },
    {
      name: "Biscuit Pack",
      price: 50,
      category: "Snacks",
      description: "Tea biscuits",
    },
  ],
  "Waffle & Crepe": [
    {
      name: "Belgian Waffle",
      price: 280,
      category: "Waffles",
      description: "Crispy waffle with toppings",
    },
    {
      name: "Chocolate Crepe",
      price: 250,
      category: "Crepes",
      description: "Crepe with chocolate",
    },
    {
      name: "Strawberry Crepe",
      price: 260,
      category: "Crepes",
      description: "Crepe with strawberry",
    },
    {
      name: "Nutella Waffle",
      price: 320,
      category: "Waffles",
      description: "Waffle with Nutella",
    },
    {
      name: "Ice Cream Sundae",
      price: 200,
      category: "Desserts",
      description: "Sundae with ice cream",
    },
  ],
};

const addMenus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let totalAdded = 0;

    for (const [restaurantName, items] of Object.entries(menuItems)) {
      const restaurant = await Restaurant.findOne({ name: restaurantName });

      if (!restaurant) {
        console.log(`⚠️  Restaurant not found: ${restaurantName}`);
        continue;
      }

      // Check if menu items already exist for this restaurant
      const existingCount = await FoodItem.countDocuments({
        restaurantId: restaurant._id,
      });

      if (existingCount > 0) {
        console.log(
          `⏭️  Skipping ${restaurantName} - already has ${existingCount} menu items`,
        );
        continue;
      }

      // Image mapping for specific dishes
      const dishImages = {
        "Chicken Tikka Masala":
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        "Butter Naan":
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        "Biryani Rice":
          "https://images.unsplash.com/photo-1606787620108-5c249b20d82f?w=400",
        "Paneer Dosa":
          "https://images.unsplash.com/photo-1589301760014-d929314c3fe6?w=400",
        "Mango Lassi":
          "https://images.unsplash.com/photo-1617183479702-18f0e04f3a2f?w=400",
        "Classic Cheeseburger":
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        "French Fries":
          "https://images.unsplash.com/photo-1585238341710-4b23c3a0b2c3?w=400",
        "Bacon BBQ Burger":
          "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400",
        "Fried Chicken Sandwich":
          "https://images.unsplash.com/photo-1562547256-a9d6b7c1b6f1?w=400",
        "Milkshake Chocolate":
          "https://images.unsplash.com/photo-1579954614171-8206a0db8003?w=400",
        "Margherita Pizza":
          "https://images.unsplash.com/photo-1599599810694-b3666dc8b900?w=400",
        "Pepperoni Pizza":
          "https://images.unsplash.com/photo-1628840042765-356cda07f6db?w=400",
        "Veggie Supreme":
          "https://images.unsplash.com/photo-1511689915169-a82edd6bed74?w=400",
        "Garlic Bread":
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        "Caesar Salad":
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        "California Roll":
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
        "Spicy Tuna Roll":
          "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
        "Dragon Roll":
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
        "Miso Soup":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        Edamame:
          "https://images.unsplash.com/photo-1609518176506-3d76fe4e5b8e?w=400",
        "Hyderabadi Biryani":
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=400",
        "Chicken Biryani":
          "https://images.unsplash.com/photo-1606787620108-5c249b20d82f?w=400",
        "Mutton Biryani":
          "https://images.unsplash.com/photo-1594521203628-4b2b1e8c2b4f?w=400",
        Raita:
          "https://images.unsplash.com/photo-1599599810694-b3666dc8b900?w=400",
        "Gulab Jamun":
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        "Carne Asada Tacos":
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        "Fish Tacos":
          "https://images.unsplash.com/photo-1618901657063-0e6f3804bab4?w=400",
        "Chicken Quesadilla":
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        "Salsa & Chips":
          "https://images.unsplash.com/photo-1585238341710-4b23c3a0b2c3?w=400",
        Churros:
          "https://images.unsplash.com/photo-1610501191165-11b565dc4bdf?w=400",
        "Vegan Buddha Bowl":
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        "Chickpea Curry":
          "https://images.unsplash.com/photo-1596040550128-0c1a90b24e15?w=400",
        "Veggie Burger":
          "https://images.unsplash.com/photo-1582618921571-cecf757a6cc5?w=400",
        "Avocado Toast":
          "https://images.unsplash.com/photo-1605087768159-0c3ff5ab3b3b?w=400",
        "Smoothie Bowl":
          "https://images.unsplash.com/photo-1590301157890-4810ed1d4c4d?w=400",
        "Pad Thai":
          "https://images.unsplash.com/photo-1585457846019-86f04177ee90?w=400",
        "Green Curry":
          "https://images.unsplash.com/photo-1455619452474-d2be8b1ab012?w=400",
        "Tom Yum Soup":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        "Spring Rolls":
          "https://images.unsplash.com/photo-1583695456223-6dd7e0a17ca0?w=400",
        "Mango Sticky Rice":
          "https://images.unsplash.com/photo-1585518419758-d2fb72f38208?w=400",
        "Chicken Shawarma":
          "https://images.unsplash.com/photo-1604888540268-d9b0e2e98f27?w=400",
        "Lamb Kebab":
          "https://images.unsplash.com/photo-1555939594-58d7cb561849?w=400",
        "Falafel Wrap":
          "https://images.unsplash.com/photo-1585237341710-4b23c3a0b2c3?w=400",
        "Hummus Plate":
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        Baklava:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        "Fettuccine Alfredo":
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        "Spaghetti Carbonara":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        Lasagna:
          "https://images.unsplash.com/photo-1579521271995-146ae0da4d5d?w=400",
        "Chicken Manchurian":
          "https://images.unsplash.com/photo-1585518419758-d2fb72f38208?w=400",
        "Chow Mein":
          "https://images.unsplash.com/photo-1585457846019-86f04177ee90?w=400",
        "Fried Rice":
          "https://images.unsplash.com/photo-1585518419758-d2fb72f38208?w=400",
        Momos:
          "https://images.unsplash.com/photo-1583695456223-6dd7e0a17ca0?w=400",
        "Chocolate Cake":
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        "Brownie Sundae":
          "https://images.unsplash.com/photo-1563805042-7684c019e0ac?w=400",
        "Chocolate Mousse":
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        Macarons:
          "https://images.unsplash.com/photo-1577003832033-a0e19b2b5e70?w=400",
        "Hot Chocolate":
          "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400",
        "Tandoori Chicken":
          "https://images.unsplash.com/photo-1588166524941-3bf0c3fa647f?w=400",
        "Paneer Tikka":
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        "Tandoori Naan":
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        "Seekh Kebab":
          "https://images.unsplash.com/photo-1555939594-58d7cb561849?w=400",
        Kulfi:
          "https://images.unsplash.com/photo-1563805042-7684c019e0ac?w=400",
        "Smoked Ribs":
          "https://images.unsplash.com/photo-1555939594-58d7cb561849?w=400",
        Brisket:
          "https://images.unsplash.com/photo-1599103442097-8015a72b5c59?w=400",
        "BBQ Chicken":
          "https://images.unsplash.com/photo-1588166524941-3bf0c3fa647f?w=400",
        Cornbread:
          "https://images.unsplash.com/photo-1585954341310-f1a5a7ead3e7?w=400",
        Coleslaw:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        "Paneer Tikka Burger":
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        "Thai Basil Pasta":
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
        "Korean Tacos":
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        "Miso Butter Naan":
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        "Matcha Cheesecake":
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        "Tomato Basil Soup":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        "Chicken & Vegetable":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        "Greek Salad":
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
        "Smoothie Bowl":
          "https://images.unsplash.com/photo-1590301157890-4810ed1d4c4d?w=400",
        "Chicken Momos":
          "https://images.unsplash.com/photo-1583695456223-6dd7e0a17ca0?w=400",
        "Vegetable Momos":
          "https://images.unsplash.com/photo-1583695456223-6dd7e0a17ca0?w=400",
        "Buff Momos":
          "https://images.unsplash.com/photo-1583695456223-6dd7e0a17ca0?w=400",
        "Momo Soup":
          "https://images.unsplash.com/photo-1612874742237-415c69f18133?w=400",
        "Ribeye Steak":
          "https://images.unsplash.com/photo-1599103442097-8015a72b5c59?w=400",
        "Filet Mignon":
          "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400",
        "NY Strip":
          "https://images.unsplash.com/photo-1599103442097-8015a72b5c59?w=400",
        "Grilled Salmon":
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        "Lobster Tail":
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        "Masala Chai":
          "https://images.unsplash.com/photo-1597318963147-a1b1b31a8d9e?w=400",
        "Ginger Chai":
          "https://images.unsplash.com/photo-1597318963147-a1b1b31a8d9e?w=400",
        Samosa:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        Pakora:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        "Biscuit Pack":
          "https://images.unsplash.com/photo-1548365328-fae3296dd4cd?w=400",
        "Belgian Waffle":
          "https://images.unsplash.com/photo-1614707267537-b85faf00021f?w=400",
        "Chocolate Crepe":
          "https://images.unsplash.com/photo-1614707267537-b85faf00021f?w=400",
        "Strawberry Crepe":
          "https://images.unsplash.com/photo-1614707267537-b85faf00021f?w=400",
        "Nutella Waffle":
          "https://images.unsplash.com/photo-1614707267537-b85faf00021f?w=400",
        "Ice Cream Sundae":
          "https://images.unsplash.com/photo-1563805042-7684c019e0ac?w=400",
      };

      // Add food items
      const foodItems = items.map((item) => ({
        ...item,
        restaurantId: restaurant._id,
        isPopular: Math.random() > 0.5,
        isBestSeller: Math.random() > 0.7,
        isAvailable: true,
        image:
          dishImages[item.name] ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      }));

      const createdItems = await FoodItem.create(foodItems);
      console.log(
        `✅ Added 5 menu items for ${restaurantName} (ID: ${restaurant._id})`,
      );
      totalAdded += createdItems.length;
    }

    console.log(`\n🎉 Total menu items added: ${totalAdded}`);

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

addMenus();
