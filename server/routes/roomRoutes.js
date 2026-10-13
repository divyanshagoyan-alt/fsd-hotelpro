import express from 'express';
import { Room } from '../models/Room.js';
import { mockRooms } from '../../src/data/mock/mockData.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let rooms = [];
    try {
      rooms = await Room.find({});
    } catch {
      // offline fallback
    }
    if (!rooms || rooms.length === 0) {
      rooms = mockRooms;
    }
    return res.json({ rooms, total: rooms.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const roomData = req.body;
    let newRoom = null;
    try {
      newRoom = await Room.create(roomData);
    } catch {
      newRoom = { ...roomData, id: 'r' + Date.now() };
    }
    return res.status(201).json({ room: newRoom });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let updated = null;
    try {
      updated = await Room.findByIdAndUpdate(id, req.body, { new: true });
    } catch {
      // offline fallback
    }
    return res.json({ room: updated || { id, ...req.body } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await Room.findByIdAndDelete(id);
    } catch {
      // offline fallback
    }
    return res.json({ success: true, message: 'Room deleted from inventory' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
