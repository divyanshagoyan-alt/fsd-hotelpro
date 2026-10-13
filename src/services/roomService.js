import apiClient from './apiClient';
import { mockRooms } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const roomService = {
  async getRooms(hotelId, filters = {}) {
    if (USE_MOCK) {
      await delay();
      let rooms = mockRooms.filter(r => r.hotelId === hotelId);
      if (filters.type) rooms = rooms.filter(r => r.type === filters.type);
      if (filters.capacity) rooms = rooms.filter(r => r.capacity >= Number(filters.capacity));
      return { rooms, total: rooms.length };
    }
    const { data } = await apiClient.get(`/hotels/${hotelId}/rooms`, { params: filters });
    return data;
  },

  async getRoom(roomId) {
    if (USE_MOCK) {
      await delay(200);
      const room = mockRooms.find(r => r.id === roomId);
      if (!room) throw new Error('Room not found');
      return room;
    }
    const { data } = await apiClient.get(`/rooms/${roomId}`);
    return data.room;
  },

  async checkAvailability(roomId, checkIn, checkOut) {
    if (USE_MOCK) {
      await delay(500);
      // Mock: rooms with status 'available' are available
      const room = mockRooms.find(r => r.id === roomId);
      return { available: room?.status === 'available', roomId, checkIn, checkOut };
    }
    const { data } = await apiClient.get(`/rooms/${roomId}/availability`, { params: { checkIn, checkOut } });
    return data;
  },

  async updateRoomStatus(roomId, status) {
    if (USE_MOCK) {
      await delay(300);
      return { success: true, roomId, status };
    }
    const { data } = await apiClient.patch(`/rooms/${roomId}/status`, { status });
    return data;
  },
};

export default roomService;
