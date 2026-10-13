import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, required: true, unique: true },
  guestId: { type: String, default: 'g1' },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, default: '' },
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  roomNumber: { type: String, default: '101' },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  nights: { type: Number, required: true, default: 1 },
  guests: { type: Number, required: true, default: 1 },
  totalAmount: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'confirmed'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
  paymentMethod: { type: String, default: 'Credit Card' },
  specialRequests: { type: String, default: '' },
}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
