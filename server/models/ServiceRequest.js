import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  guestName: { type: String, default: 'In-House Guest' },
  type: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'complete'], default: 'open' },
  priority: { type: String, enum: ['normal', 'high'], default: 'normal' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);
