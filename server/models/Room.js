import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  roomNumber: { type: String, required: true },
  type: { type: String, required: true, default: 'Deluxe' },
  category: { type: String, default: 'Room' },
  capacity: { type: Number, default: 2 },
  bedType: { type: String, default: 'King' },
  size: { type: Number, default: 35 },
  pricePerNight: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied', 'cleaning', 'maintenance'], default: 'available' },
  floor: { type: Number, default: 1 },
  image: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  description: { type: String, default: '' },
  maxGuests: { type: Number, default: 2 },
  isRefundable: { type: Boolean, default: true },
  taxRate: { type: Number, default: 0.18 },
}, { timestamps: true });

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
