import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: 'India' },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 100 },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  images: [{ type: String }],
  priceFrom: { type: Number, required: true },
  amenities: [{ type: String }],
  category: { type: String, default: 'Luxury' },
  totalRooms: { type: Number, default: 50 },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '12:00' },
  cancellationPolicy: { type: String, default: 'Free cancellation up to 48 hours before check-in.' },
  coordinates: {
    lat: { type: Number, default: 18.9219 },
    lng: { type: Number, default: 72.8347 }
  }
}, { timestamps: true });

export const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
