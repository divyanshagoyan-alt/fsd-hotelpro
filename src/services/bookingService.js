import apiClient from './apiClient';
import { mockReservations } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

const bookingService = {
  async createBooking(bookingData) {
    if (USE_MOCK) {
      await delay(800);
      // MOCK: Does NOT process real payment. Returns simulated confirmation.
      const newBooking = {
        ...bookingData,
        id: 'res' + Date.now(),
        status: 'confirmed',
        bookingRef: 'HP-MOCK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };
      return { booking: newBooking, message: '[MOCK] Booking confirmed. Not a real transaction.' };
    }
    const { data } = await apiClient.post('/bookings', bookingData);
    return data;
  },

  async getMyBookings(guestId) {
    if (USE_MOCK) {
      await delay();
      const bookings = mockReservations.filter(r => r.guestId === guestId);
      return { bookings };
    }
    const { data } = await apiClient.get('/bookings/my');
    return data;
  },

  async getBooking(bookingId) {
    if (USE_MOCK) {
      await delay(200);
      const booking = mockReservations.find(r => r.id === bookingId);
      if (!booking) throw new Error('Booking not found');
      return booking;
    }
    const { data } = await apiClient.get(`/bookings/${bookingId}`);
    return data.booking;
  },

  async cancelBooking(bookingId, reason) {
    if (USE_MOCK) {
      await delay(600);
      return { success: true, bookingId, message: '[MOCK] Cancellation processed. Not a real refund.' };
    }
    const { data } = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
    return data;
  },

  async getAllBookings(filters = {}) {
    if (USE_MOCK) {
      await delay();
      let bookings = [...mockReservations];
      if (filters.status) bookings = bookings.filter(b => b.status === filters.status);
      if (filters.hotelId) bookings = bookings.filter(b => b.hotelId === filters.hotelId);
      return { bookings, total: bookings.length };
    }
    const { data } = await apiClient.get('/bookings', { params: filters });
    return data;
  },

  async checkIn(bookingId) {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, bookingId, status: 'checked-in' };
    }
    const { data } = await apiClient.patch(`/bookings/${bookingId}/check-in`);
    return data;
  },

  async checkOut(bookingId) {
    if (USE_MOCK) {
      await delay(400);
      return { success: true, bookingId, status: 'checked-out' };
    }
    const { data } = await apiClient.patch(`/bookings/${bookingId}/check-out`);
    return data;
  },
};

export default bookingService;
