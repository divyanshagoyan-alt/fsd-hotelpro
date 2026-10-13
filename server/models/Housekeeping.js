import mongoose from 'mongoose';

const housekeepingSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomName: { type: String, required: true },
  status: { type: String, enum: ['complete', 'cleaning', 'pending', 'maintenance'], default: 'pending' },
  assignedTo: { type: String, default: '' },
  priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const Housekeeping = mongoose.models.Housekeeping || mongoose.model('Housekeeping', housekeepingSchema);
