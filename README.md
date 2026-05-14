# 🍕 FoodApp — Full-Stack MERN Food Ordering Platform

A production-ready online food ordering platform built with MongoDB, Express.js, React.js, and Node.js.

---

## 📁 Folder Structure

```
foodapp/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile, password
│   │   ├── restaurantController.js # CRUD for restaurants
│   │   ├── foodController.js       # CRUD for food items
│   │   ├── orderController.js      # Create, track, update orders
│   │   ├── reviewController.js     # Reviews & ratings
│   │   └── adminController.js      # Dashboard stats, user management
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                 # Users collection
│   │   ├── Restaurant.js           # Restaurants collection
│   │   ├── FoodItem.js             # Food items collection
│   │   ├── Order.js                # Orders collection
│   │   └── Review.js               # Reviews collection
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── reviewRoutes.js
│   ├── seed.js                     # Seed sample data
│   ├── server.js                   # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── auth/
        │   │   ├── Auth.js          # Login & Register forms
        │   │   └── Auth.css
        │   ├── common/
        │   │   ├── Navbar.js        # Sticky navbar with cart badge
        │   │   ├── Navbar.css
        │   │   ├── Footer.js
        │   │   └── Footer.css
        │   └── food/
        │       ├── RestaurantCard.js
        │       ├── RestaurantCard.css
        │       ├── FoodCard.js      # Add to cart, quantity control
        │       └── FoodCard.css
        ├── context/
        │   ├── AuthContext.js       # Auth state, login/logout
        │   └── CartContext.js       # Cart state, localStorage persist
        ├── pages/
        │   ├── Home.js              # Hero, categories, restaurants, popular
        │   ├── Home.css
        │   ├── Restaurants.js       # Listing with search & filters
        │   ├── Restaurants.css
        │   ├── RestaurantDetail.js  # Menu by category
        │   ├── RestaurantDetail.css
        │   ├── Cart.js              # Cart + checkout
        │   ├── Cart.css
        │   ├── Orders.js            # Order list + real-time detail view
        │   ├── Orders.css
        │   ├── Profile.js           # Edit profile & change password
        │   ├── Profile.css
        │   ├── Admin.js             # Full admin panel
        │   └── Admin.css
        ├── services/
        │   └── api.js               # Axios instance with interceptors
        ├── styles/
        │   └── globals.css          # Design system, CSS variables
        ├── App.js                   # Router + layout
        └── index.js
```

---

## 🗄️ MongoDB Collections

| Collection  | Key Fields |
|-------------|-----------|
| **Users**   | name, email, password (hashed), role (user/admin), address, phone, isActive |
| **Restaurants** | name, description, image, location, cuisine[], rating, deliveryTime, deliveryFee, isOpen |
| **FoodItems** | name, price, category, restaurantId, description, image, isPopular, isBestSeller, rating |
| **Orders** | userId, restaurantId, items[], totalAmount, deliveryFee, taxes, grandTotal, status, statusHistory[] |
| **Reviews** | userId, targetId, targetType (restaurant/foodItem), rating, comment, orderId |

---

## 🔌 API Routes

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login + receive JWT |
| GET  | `/me` | ✅ | Get logged-in user |
| PUT  | `/profile` | ✅ | Update profile |
| PUT  | `/change-password` | ✅ | Change password |

### Restaurants — `/api/restaurants`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | List all (search, filter, paginate) |
| GET | `/:id` | ❌ | Restaurant + grouped menu |
| POST | `/` | 🔐 Admin | Create restaurant |
| PUT | `/:id` | 🔐 Admin | Update restaurant |
| DELETE | `/:id` | 🔐 Admin | Soft delete |

### Food Items — `/api/food`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | List items (filter by restaurant, category, popular) |
| GET | `/categories` | ❌ | Distinct categories |
| GET | `/:id` | ❌ | Single food item |
| POST | `/` | 🔐 Admin | Create food item |
| PUT | `/:id` | 🔐 Admin | Update food item |
| DELETE | `/:id` | 🔐 Admin | Soft delete (isAvailable: false) |

### Orders — `/api/orders`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/` | ✅ | Place new order |
| GET | `/my-orders` | ✅ | User's order history |
| GET | `/all` | 🔐 Admin | All orders |
| GET | `/:id` | ✅ | Single order (owner/admin) |
| PUT | `/:id/status` | 🔐 Admin | Update order status |
| PUT | `/:id/cancel` | ✅ | Cancel order (if not in progress) |

### Reviews — `/api/reviews`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get reviews (filter by targetId, targetType) |
| POST | `/` | ✅ | Add review |
| DELETE | `/:id` | ✅ | Delete own review |

### Admin — `/api/admin`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard` | 🔐 Admin | Stats, charts data |
| GET | `/users` | 🔐 Admin | List all users |
| PUT | `/users/:id/toggle` | 🔐 Admin | Activate/deactivate user |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or MongoDB Atlas URI)
- npm or yarn

---

### 1. Clone & Setup Backend

```bash
cd foodapp/backend

# Copy environment variables
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET

# Install dependencies
npm install

# Seed sample data (restaurants, food items, users)
npm run seed
# Outputs:
# Admin: admin@foodapp.com / admin123
# User:  john@example.com  / password123

# Start backend
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs on: **http://localhost:5000**

---

### 2. Setup Frontend

```bash
cd foodapp/frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend runs on: **http://localhost:3000**

> The React app proxies API calls to `localhost:5000` via the `"proxy"` field in `package.json`.

---

### 3. Environment Variables (backend/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodapp
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| JWT Authentication (register/login) | ✅ |
| Password hashing (bcrypt) | ✅ |
| Restaurant listing with search & filters | ✅ |
| Food menu grouped by category | ✅ |
| Add/remove/update cart items | ✅ |
| Cart persisted in localStorage | ✅ |
| Place orders with delivery address | ✅ |
| Real-time order status tracker | ✅ |
| Order history per user | ✅ |
| Reviews & ratings system | ✅ |
| Admin dashboard with stats | ✅ |
| Admin CRUD for restaurants & food | ✅ |
| Admin order status management | ✅ |
| Admin user activation/deactivation | ✅ |
| Responsive mobile-first UI | ✅ |
| Protected routes (auth + admin) | ✅ |

---

## 🎨 Design System

- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Primary Color**: #FF4500 (burnt orange)
- **Accent Color**: #FFB800 (golden yellow)
- **CSS Variables** for full theme consistency
- Smooth animations, hover effects, loading skeletons

---

## 🔮 Optional Enhancements

1. **Razorpay / Stripe Payment** — Integrate in `Cart.js` before `api.post('/orders')`
2. **Socket.io** — Real-time order status push notifications
3. **Cloudinary** — Image upload for restaurants & food items
4. **Redis** — Cache popular restaurants / menu
5. **Email Notifications** — Nodemailer for order confirmations
