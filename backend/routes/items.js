const express = require('express');
const router = require('express').Router();
const Item = require('../models/Item');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { uploadImage } = require('../utils/cloudinary');

// Get all items (Publicly accessible for store exploration)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Fetch items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to update or create Category on-the-fly
async function getOrCreateCategory(categoryName, categoryCode) {
  let cat = await Category.findOne({ name: categoryName.trim() });
  if (!cat) {
    cat = new Category({
      name: categoryName.trim(),
      code: categoryCode.trim().toUpperCase()
    });
    await cat.save();
  }
  return cat;
}

// Create or update item (Admin only)
router.post('/', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const { id, code, title, category: catName, categoryCode: catCode, price, image, colors } = req.body;

    // Check if it's an update operation (id present)
    if (id) {
      return await handleUpdateInternal(id, req.body, res);
    }

    // Otherwise, create new
    if (!code || !title || !catName || !catCode || price === undefined || !image) {
      return res.status(400).json({ error: 'Missing required item fields' });
    }

    const existingCode = await Item.findOne({ code: code.trim().toUpperCase() });
    if (existingCode) {
      return res.status(400).json({ error: 'Item code already exists' });
    }

    const categoryObj = await getOrCreateCategory(catName, catCode);

    // Upload to Cloudinary securely if the image is a base64 string
    const imageUrl = await uploadImage(image);

    const newItem = new Item({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      category: categoryObj.name,
      categoryCode: categoryObj.code,
      price: Number(price),
      image: imageUrl,
      colors: colors || []
    });

    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Internal update logic
async function handleUpdateInternal(id, body, res) {
  try {
    const { title, category: catName, categoryCode: catCode, price, image, colors } = body;

    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(444).json({ error: 'Item not found' }); // Use status matching Spring Boot's NOT_FOUND (404)
    }

    const categoryObj = await getOrCreateCategory(catName || existingItem.category, catCode || existingItem.categoryCode);

    if (title !== undefined) existingItem.title = title.trim();
    existingItem.category = categoryObj.name;
    existingItem.categoryCode = categoryObj.code;
    if (price !== undefined) existingItem.price = Number(price);
    
    // Upload new image to Cloudinary if it was updated
    if (image !== undefined) {
      existingItem.image = await uploadImage(image);
    }
    
    if (colors !== undefined) existingItem.colors = colors;

    await existingItem.save();
    res.json(existingItem);
  } catch (error) {
    console.error('Update item internal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update via PUT (Admin only)
router.put('/:id', auth, authorize('ADMIN'), async (req, res) => {
  await handleUpdateInternal(req.params.id, req.body, res);
});

// Update via POST with id in path (Admin only)
router.post('/:id/update', auth, authorize('ADMIN'), async (req, res) => {
  await handleUpdateInternal(req.params.id, req.body, res);
});

// Update via POST /save-changes (Admin only)
router.post('/save-changes', auth, authorize('ADMIN'), async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Item id is required' });
  }
  await handleUpdateInternal(id, req.body, res);
});

// Helper delete logic
async function handleDeleteInternal(id, res) {
  try {
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await Item.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete via DELETE (Admin only)
router.delete('/:id', auth, authorize('ADMIN'), async (req, res) => {
  await handleDeleteInternal(req.params.id, res);
});

// Delete via POST with id in path (Admin only)
router.post('/:id/delete', auth, authorize('ADMIN'), async (req, res) => {
  await handleDeleteInternal(req.params.id, res);
});

// Delete via POST /delete with payload { id } (Admin only)
router.post('/delete', auth, authorize('ADMIN'), async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Item id is required' });
  }
  await handleDeleteInternal(id, res);
});

module.exports = router;
