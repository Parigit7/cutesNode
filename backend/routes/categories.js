const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Get all categories (Publicly accessible for store exploration)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category (Admin only)
router.post('/', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Category name and code are required' });
    }

    const existingName = await Category.findOne({ name: name.trim() });
    const existingCode = await Category.findOne({ code: code.trim().toUpperCase() });
    
    if (existingName || existingCode) {
      return res.status(400).json({ error: 'Category name or code already exists' });
    }

    const category = new Category({
      name: name.trim(),
      code: code.trim().toUpperCase()
    });

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
