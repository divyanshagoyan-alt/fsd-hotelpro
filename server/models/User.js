import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, default: 'demo123' },
  role: { type: String, enum: ['guest', 'staff', 'manager', 'admin'], default: 'guest' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: null },
  memberSince: { type: String, default: () => new Date().toISOString().split('T')[0] },
  preferences: {
    roomType: { type: String, default: 'Deluxe' },
    bedType: { type: String, default: 'King' },
    dietary: { type: String, default: 'Vegetarian' },
    floorPreference: { type: String, default: 'High Floor' }
  },
  loyaltyPoints: { type: Number, default: 1000 },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
