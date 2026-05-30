const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!user.active) {
      return res.status(401).json({ error: 'User is inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token matching Java format (subject: username)
    const token = jwt.sign(
      { sub: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    res.json({
      token,
      id: user.id,
      username: user.username,
      role: user.role,
      active: user.active
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
