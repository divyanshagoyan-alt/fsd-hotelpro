import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Hotel } from '../models/Hotel.js';
import { Room } from '../models/Room.js';
import { Booking } from '../models/Booking.js';
import { Housekeeping } from '../models/Housekeeping.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { AuditLog } from '../models/AuditLog.js';
import {
  mockHotels,
  mockRooms,
  mockReservations,
  mockStaff,
  mockHousekeeping,
  mockRequests,
  mockAuditLogs,
  mockGuest,
  mockAdmin
} from '../../src/data/mock/mockData.js';

export async function seedDatabase() {
  const conn = await connectDB();
  if (!conn) {
    console.log('[Seed] Skipped seeding: MongoDB connection unavailable.');
    return;
  }

  try {
    console.log('[Seed] Seeding MongoDB with HotelPro initial data...');

    // Users
    const usersToInsert = [
      mockGuest,
      mockAdmin,
      { id: 's1', name: 'Kavita Desai', role: 'staff', email: 'staff@demo.com', phone: '+91 98000 11111', password: 'demo123' },
      { id: 'm1', name: 'Anjali Mehta', role: 'manager', email: 'manager@demo.com', phone: '+91 98000 55555', password: 'demo123' },
    ];
    for (const u of usersToInsert) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${usersToInsert.length} demo users.`);

    // Hotels
    for (const h of mockHotels) {
      await Hotel.findOneAndUpdate({ slug: h.slug }, h, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${mockHotels.length} luxury hotels.`);

    // Rooms
    for (const r of mockRooms) {
      await Room.findOneAndUpdate({ roomNumber: r.roomNumber, hotelId: r.hotelId }, r, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${mockRooms.length} room inventories.`);

    // Bookings / Reservations
    for (const b of mockReservations) {
      await Booking.findOneAndUpdate({ bookingRef: b.bookingRef }, b, { upsert: true, new: true });
    }
    console.log(`[Seed] Seeded ${mockReservations.length} reservations.`);

    // Housekeeping
    for (const hk of mockHousekeeping) {
      await Housekeeping.findOneAndUpdate({ roomNumber: hk.roomNumber }, hk, { upsert: true, new: true });
    }

    // Service Requests
    for (const req of mockRequests) {
      await ServiceRequest.findOneAndUpdate({ roomNumber: req.roomNumber, type: req.type }, req, { upsert: true, new: true });
    }

    // Audit logs
    for (const al of mockAuditLogs) {
      await AuditLog.findOneAndUpdate({ action: al.action, timestamp: al.timestamp }, al, { upsert: true, new: true });
    }

    console.log('[Seed] Database initialization completed successfully!');
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message);
  }
}

// If run directly via CLI (node server/seed/seed.js)
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
