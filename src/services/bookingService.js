import apiClient from './apiClient';
import { mockReservations } from '../data/mock/mockData';

const LOCAL_STORAGE_KEY = 'hotelpro_offline_reservations';

// Load stored offline reservations from localStorage
export const getStoredOfflineBookings = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Save a booking into offline localStorage and unshift into in-memory mockReservations
export const saveOfflineBooking = (newBooking) => {
  try {
    const existing = getStoredOfflineBookings();
    const filtered = existing.filter(b => b.bookingRef !== newBooking.bookingRef && b.id !== newBooking.id);
    const updated = [newBooking, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Also update in-memory mockReservations so UI components immediately see it
    const existingMockIdx = mockReservations.findIndex(
      b => b.bookingRef === newBooking.bookingRef || b.id === newBooking.id
    );
    if (existingMockIdx >= 0) {
      mockReservations[existingMockIdx] = newBooking;
    } else {
      mockReservations.unshift(newBooking);
    }
  } catch (err) {
    console.warn('[Offline Storage] Failed to write to localStorage:', err);
  }
};

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const bookingService = {
  /**
   * Process booking creation with offline fake payment simulation.
   * Guaranteed never to fail with "Network Error" even when completely offline or backend is down.
   */
  async createBooking(bookingData) {
    // 1. Generate realistic fake / offline reservation
    const bookingRef = bookingData.bookingRef || 'HP-2026-' + Math.floor(100 + Math.random() * 900);
    const simulatedTxn = 'TXN-DEMO-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const isPayAtProperty =
      (bookingData.paymentMethod || '').toLowerCase().includes('property') ||
      (bookingData.paymentMethod || '').toLowerCase().includes('cash');

    const localBooking = {
      ...bookingData,
      id: bookingData.id || ('res_' + Date.now()),
      bookingRef,
      status: 'confirmed',
      paymentStatus: isPayAtProperty ? 'pending' : 'paid',
      paymentMethod: bookingData.paymentMethod || 'Credit Card (Simulated)',
      paymentTransactionId: isPayAtProperty ? 'N/A (Pay at Check-In)' : simulatedTxn,
      isOfflineSimulated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save locally first so data is never lost
    saveOfflineBooking(localBooking);

    // 2. Try to sync with backend if online (with a short 2s timeout), but NEVER fail if backend is down
    try {
      const syncPromise = apiClient.post('/bookings', localBooking);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Backend timeout')), 2000)
      );
      const res = await Promise.race([syncPromise, timeoutPromise]);
      if (res?.data?.booking) {
        saveOfflineBooking(res.data.booking);
        return {
          booking: res.data.booking,
          message: 'Payment simulated successfully. Saved to database and local store.',
          isOffline: false,
        };
      }
    } catch (backendErr) {
      console.info(
        '[HotelPro Offline Payment] Backend sync bypassed or offline:',
        backendErr.message || backendErr
      );
    }

    // Return successful simulated payment response
    await delay(300);
    return {
      booking: localBooking,
      message: 'Payment simulated successfully! Reservation confirmed in offline sandbox mode.',
      isOffline: true,
    };
  },

  async getMyBookings(guestId = 'g1') {
    const offlineList = getStoredOfflineBookings();
    try {
      const { data } = await apiClient.get('/bookings/my', { params: { guestId } });
      if (data?.bookings) {
        // Merge offline bookings not yet in backend
        const backendRefs = new Set(data.bookings.map(b => b.bookingRef));
        const missingOffline = offlineList.filter(b => !backendRefs.has(b.bookingRef));
        return { bookings: [...missingOffline, ...data.bookings] };
      }
    } catch {
      // Offline fallback
    }

    const merged = [
      ...offlineList,
      ...mockReservations.filter(r => r.guestId === guestId || !guestId),
    ];
    // Deduplicate by bookingRef
    const seen = new Set();
    const unique = merged.filter(b => {
      const key = b.bookingRef || b.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { bookings: unique };
  },

  async getBooking(bookingId) {
    const offlineList = getStoredOfflineBookings();
    const localMatch = offlineList.find(r => r.id === bookingId || r.bookingRef === bookingId);
    if (localMatch) return localMatch;

    try {
      const { data } = await apiClient.get(`/bookings/${bookingId}`);
      if (data?.booking) return data.booking;
    } catch {
      // Offline fallback
    }

    const mockMatch = mockReservations.find(r => r.id === bookingId || r.bookingRef === bookingId);
    if (mockMatch) return mockMatch;

    return localMatch || null;
  },

  async cancelBooking(bookingId, reason = 'Guest cancelled') {
    // Update local storage
    const offlineList = getStoredOfflineBookings();
    const updatedOffline = offlineList.map(b => {
      if (b.id === bookingId || b.bookingRef === bookingId) {
        return { ...b, status: 'cancelled', specialRequests: `Cancelled: ${reason}` };
      }
      return b;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOffline));

    // Update in-memory mockReservations
    const mock = mockReservations.find(b => b.id === bookingId || b.bookingRef === bookingId);
    if (mock) {
      mock.status = 'cancelled';
      mock.specialRequests = `Cancelled: ${reason}`;
    }

    try {
      await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
    } catch {
      // Ignore offline error
    }

    return {
      success: true,
      bookingId,
      status: 'cancelled',
      message: 'Reservation cancelled successfully.',
    };
  },

  async getAllBookings(filters = {}) {
    const offlineList = getStoredOfflineBookings();
    try {
      const { data } = await apiClient.get('/bookings', { params: filters });
      if (data?.bookings) {
        const backendRefs = new Set(data.bookings.map(b => b.bookingRef));
        const missingOffline = offlineList.filter(b => !backendRefs.has(b.bookingRef));
        let all = [...missingOffline, ...data.bookings];
        if (filters.status) all = all.filter(b => b.status === filters.status);
        return { bookings: all, total: all.length };
      }
    } catch {
      // Offline fallback
    }

    let bookings = [...offlineList, ...mockReservations];
    const seen = new Set();
    const unique = bookings.filter(b => {
      const key = b.bookingRef || b.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (filters.status) {
      return { bookings: unique.filter(b => b.status === filters.status), total: unique.length };
    }
    return { bookings: unique, total: unique.length };
  },

  async checkIn(bookingId) {
    const offlineList = getStoredOfflineBookings();
    const updatedOffline = offlineList.map(b => (b.id === bookingId || b.bookingRef === bookingId ? { ...b, status: 'checked-in' } : b));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOffline));

    const mock = mockReservations.find(b => b.id === bookingId || b.bookingRef === bookingId);
    if (mock) mock.status = 'checked-in';

    try {
      await apiClient.patch(`/bookings/${bookingId}/check-in`);
    } catch {
      // offline
    }
    return { success: true, bookingId, status: 'checked-in' };
  },

  async checkOut(bookingId) {
    const offlineList = getStoredOfflineBookings();
    const updatedOffline = offlineList.map(b => (b.id === bookingId || b.bookingRef === bookingId ? { ...b, status: 'checked-out' } : b));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedOffline));

    const mock = mockReservations.find(b => b.id === bookingId || b.bookingRef === bookingId);
    if (mock) mock.status = 'checked-out';

    try {
      await apiClient.patch(`/bookings/${bookingId}/check-out`);
    } catch {
      // offline
    }
    return { success: true, bookingId, status: 'checked-out' };
  },
};

export default bookingService;
