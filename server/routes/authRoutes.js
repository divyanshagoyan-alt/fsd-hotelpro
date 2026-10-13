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
    const { name, email, password, role = 'guest', phone } = req.body;
    let createdUser = null;
    try {
      createdUser = await User.create({ name, email, password, role, phone });
    } catch {
      createdUser = { id: 'usr' + Date.now(), name, email, role, phone };
    }

    return res.status(201).json({
      user: createdUser,
      token: `jwt-token-${createdUser.role}-${Date.now()}`
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  return res.json({ user: mockGuest });
});

export default router;
