import express from 'express';
import { User } from '../models/User.js';
import { mockGuest } from '../../src/data/mock/mockData.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    let user = null;
    try {
      user = await User.findOne({ email });
    } catch {
      // Offline fallback
    }

    if (!user) {
      // Demo credentials fallback
      if (email === 'guest@demo.com' && password === 'demo123') {
        user = mockGuest;
      } else if (email === 'staff@demo.com' && password === 'demo123') {
        user = { ...mockGuest, id: 's1', name: 'Kavita Desai', role: 'staff', email };
      } else if (email === 'manager@demo.com' && password === 'demo123') {
        user = { ...mockGuest, id: 'm1', name: 'Anjali Mehta', role: 'manager', email };
      } else if (email === 'admin@demo.com' && password === 'demo123') {
        user = { ...mockGuest, id: 'admin1', name: 'Platform Administrator', role: 'admin', email };
      } else {
        return res.status(401).json({ message: 'Invalid credentials. Use guest/staff/manager/admin@demo.com with password demo123' });
      }
    }

    return res.json({
      user: {
        id: user._id?.toString() || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        loyaltyPoints: user.loyaltyPoints || 2480,
        preferences: user.preferences,
      },
      token: `jwt-token-${user.role}-${Date.now()}`
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'guest', phone = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let createdUser = null;

    try {
      // Check if user already exists in DB
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' });
      }

      createdUser = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: role || 'guest',
        phone,
      });
    } catch (dbErr) {
      // Handle MongoDB duplicate key error code 11000
      if (dbErr.code === 11000) {
        return res.status(409).json({ message: 'An account with this email already exists. Please sign in.' });
      }
      // Offline fallback
      console.warn('[Auth] Registration using offline fallback:', dbErr.message);
      createdUser = {
        id: 'usr-' + Date.now(),
        name,
        email: normalizedEmail,
        role: role || 'guest',
        phone,
        loyaltyPoints: 1000,
        memberSince: new Date().toISOString().split('T')[0],
      };
    }

    const userObj = {
      id: createdUser._id?.toString() || createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      phone: createdUser.phone || '',
      loyaltyPoints: createdUser.loyaltyPoints || 1000,
      memberSince: createdUser.memberSince || new Date().toISOString().split('T')[0],
      preferences: createdUser.preferences || {
        roomType: 'Deluxe',
        bedType: 'King',
        dietary: 'Vegetarian',
        floorPreference: 'High Floor'
      },
    };

    return res.status(201).json({
      user: userObj,
      token: `jwt-token-${userObj.role}-${Date.now()}`
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
});

router.get('/me', async (req, res) => {
  return res.json({ user: mockGuest });
});

export default router;
