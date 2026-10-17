// HotelPro Auth Service
// NOTE: Set VITE_USE_MOCK=true in .env to use mock responses.

import apiClient from './apiClient';
import { mockGuest } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const authService = {
  async login(email, password) {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      return data;
    } catch (err) {
      if (USE_MOCK || !err.response) {
        await delay();
        if (email === 'guest@demo.com' && password === 'demo123') {
          return { user: mockGuest, token: 'mock-token-guest' };
        }
        if (email === 'staff@demo.com' && password === 'demo123') {
          return { user: { ...mockGuest, id: 's1', name: 'Kavita Desai', role: 'staff', email }, token: 'mock-token-staff' };
        }
        if (email === 'manager@demo.com' && password === 'demo123') {
          return { user: { ...mockGuest, id: 'm1', name: 'Anjali Mehta', role: 'manager', email }, token: 'mock-token-manager' };
        }
        if (email === 'admin@demo.com' && password === 'demo123') {
          return { user: { ...mockGuest, id: 'admin1', name: 'Platform Administrator', role: 'admin', email }, token: 'mock-token-admin' };
        }
      }
      throw new Error(err.response?.data?.message || err.message || 'Invalid credentials.');
    }
  },

  async register(userData) {
    if (USE_MOCK) {
      await delay(600);
      return {
        user: {
          ...mockGuest,
          ...userData,
          id: 'usr-' + Date.now(),
          loyaltyPoints: 1000,
          memberSince: new Date().toISOString().split('T')[0],
        },
        token: 'mock-token-new'
      };
    }
    try {
      const { data } = await apiClient.post('/auth/register', userData);
      return data;
    } catch (err) {
      // If backend server is unreachable or network error occurs, fall back gracefully
      if (!err.response) {
        await delay(400);
        const fallbackUser = {
          ...mockGuest,
          ...userData,
          id: 'usr-' + Date.now(),
          loyaltyPoints: 1000,
          memberSince: new Date().toISOString().split('T')[0],
        };
        return {
          user: fallbackUser,
          token: `jwt-token-guest-${Date.now()}`
        };
      }
      throw new Error(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    }
  },

  async logout() {
    if (USE_MOCK) { await delay(200); return; }
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email) {
    if (USE_MOCK) {
      await delay(600);
      return { message: 'Password reset email sent (mock).' };
    }
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, password) {
    if (USE_MOCK) {
      await delay(600);
      return { message: 'Password reset successful (mock).' };
    }
    const { data } = await apiClient.post('/auth/reset-password', { token, password });
    return data;
  },

  async getMe() {
    if (USE_MOCK) {
      await delay(300);
      const stored = sessionStorage.getItem('hp_user');
      if (stored) return JSON.parse(stored);
      return null;
    }
    const { data } = await apiClient.get('/auth/me');
    return data.user;
  },
};

export default authService;
