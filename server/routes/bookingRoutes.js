import express from 'express';
import { Booking } from '../models/Booking.js';
import { mockReservations } from '../../src/data/mock/mockData.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingRef = bookingData.bookingRef || 'HP-2026-' + Math.floor(100 + Math.random() * 900);
    const newDoc = {
      ...bookingData,
      bookingRef,
      status: 'confirmed',
      paymentStatus: 'paid',
    };

    let created = null;
    try {
      created = await Booking.create(newDoc);
    } catch {
      created = { ...newDoc, id: 'res' + Date.now() };
    }

    return res.status(201).json({
      booking: created,
      message: 'Booking confirmed successfully.'
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let bookings = [];
    try {
      bookings = await Booking.find({}).sort({ createdAt: -1 });
    } catch {
      // offline fallback
    }
    if (!bookings || bookings.length === 0) {
      bookings = mockReservations;
    }
    return res.json({ bookings, total: bookings.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/my', async (req, res) => {
  const guestId = req.query.guestId || 'g1';
  try {
    let bookings = [];
    try {
      bookings = await Booking.find({ guestId }).sort({ createdAt: -1 });
    } catch {
      // offline fallback
    }
    if (!bookings || bookings.length === 0) {
      bookings = mockReservations.filter(r => r.guestId === guestId);
    }
    return res.json({ bookings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let booking = null;
    try {
      booking = await Booking.findOne({ $or: [{ _id: id }, { bookingRef: id }, { id: id }] });
    } catch {
      // offline fallback
    }
    if (!booking) {
      booking = mockReservations.find(r => r.id === id || r.bookingRef === id);
    }
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json({ booking });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/check-in', async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await Booking.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, { status: 'checked-in' });
    } catch {
      // offline fallback
    }
    return res.json({ success: true, bookingId: id, status: 'checked-in' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/check-out', async (req, res) => {
  const { id } = req.params;
  try {
    try {
      await Booking.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, { status: 'checked-out' });
    } catch {
      // offline fallback
    }
    return res.json({ success: true, bookingId: id, status: 'checked-out' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    try {
      await Booking.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, { status: 'cancelled', specialRequests: `Cancelled: ${reason}` });
    } catch {
      // offline fallback
    }
    return res.json({ success: true, bookingId: id, status: 'cancelled', message: 'Cancellation processed.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
