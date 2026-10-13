import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  ip: { type: String, default: '127.0.0.1' },
  timestamp: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
