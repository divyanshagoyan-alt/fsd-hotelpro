import express from 'express';
import { Hotel } from '../models/Hotel.js';
import { Room } from '../models/Room.js';
import { mockHotels, mockRooms } from '../../src/data/mock/mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let hotels = [];
    try {
      hotels = await Hotel.find({});
    } catch {
      // offline fallback
    }
    if (!hotels || hotels.length === 0) {
      hotels = mockHotels;
    }
    return res.json({ hotels, total: hotels.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let hotel = null;
    try {
      hotel = await Hotel.findOne({ $or: [{ _id: id }, { slug: id }, { id: id }] });
    } catch {
      // offline fallback
    }
    if (!hotel) {
      hotel = mockHotels.find(h => h.id === id || h.slug === id);
    }
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    return res.json({ hotel });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id/rooms', async (req, res) => {
  const { id } = req.params;
  try {
    let rooms = [];
    try {
      rooms = await Room.find({ hotelId: id });
    } catch {
      // offline fallback
    }
    if (!rooms || rooms.length === 0) {
      rooms = mockRooms.filter(r => r.hotelId === id);
    }
    return res.json({ rooms });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
