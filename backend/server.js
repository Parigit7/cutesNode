require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const itemRoutes = require('./routes/items');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS matching Spring Boot configuration
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for convenience, matching Spring Boot's broad configuration
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set JSON payload limits to support large base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection & Startup
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cuteslkdb')
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Seeding logic matching DataInitializer.java
async function seedDatabase() {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        active: true
      });
      await adminUser.save();
      console.log('Seeded default admin user (admin / admin123).');
    }

    // 2. Seed Default Categories
    const defaultCategories = [
      { name: "Gift Pack", code: "GF" },
      { name: "Birthday cards", code: "BR" },
      { name: "HAIR ITEMS", code: "HR" },
      { name: "MUGS", code: "MG" },
      { name: "PURFUME", code: "PF" },
      { name: "SOFT TOY", code: "ST" },
      { name: "WALLETS", code: "WL" },
      { name: "WATER BOTTLE", code: "WT" },
      { name: "DRESS", code: "DR" },
      { name: "JEWELLER", code: "JW" },
      { name: "MAKEUP ITEM", code: "MK" },
      { name: "STATIONARY", code: "SN" },
      { name: "KEY TAGS", code: "KE" }
    ];

    let seededCount = 0;
    for (const cat of defaultCategories) {
      const catExists = await Category.findOne({ 
        $or: [{ name: cat.name }, { code: cat.code }] 
      });
      
      if (!catExists) {
        const newCat = new Category({
          name: cat.name,
          code: cat.code,
          active: true
        });
        await newCat.save();
        seededCount++;
      }
    }
    
    if (seededCount > 0) {
      console.log(`Seeded ${seededCount} new category records.`);
    }
  } catch (error) {
    console.error('Data seeding failed:', error);
  }
}

// Middleware to ensure all backend JSON error responses have a "message" field
// so the frontend error handlers don't fallback to "Order ID already exists."
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (obj) {
    if (obj && obj.error && !obj.message) {
      obj.message = obj.error;
    }
    return originalJson.call(this, obj);
  };
  next();
});

// Routes registration on /api to match axios endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);

// General 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// General Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server error stack:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});
