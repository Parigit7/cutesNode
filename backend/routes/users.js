const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Apply auth and authorize ADMIN middleware to all user routes
router.use(auth, authorize('ADMIN'));

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // toJSON will automatically format/transform output
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, password, role, active } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const rawPassword = password && password.trim() ? password : 'password123';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
      role: (role || 'ADMIN').toUpperCase(),
      active: active !== undefined ? active : true
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.post('/update', async (req, res) => {
  try {
    const { id, username, password, role, active } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User id is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (username && username.trim()) {
      const existingUser = await User.findOne({ username: username.trim() });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user.username = username.trim();
    }

    if (role && role.trim()) {
      user.role = role.toUpperCase();
    }

    if (active !== undefined) {
      user.active = active;
    }

    if (password && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
