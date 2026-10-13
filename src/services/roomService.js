import apiClient from './apiClient';
import { mockRooms } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const filterMockRooms = (hotelId, filters = {}) => {
  let rooms = mockRooms.filter(r => r.hotelId === hotelId);
  if (filters.type) rooms = rooms.filter(r => r.type === filters.type);
  if (filters.capacity) rooms = rooms.filter(r => r.capacity >= Number(filters.capacity));
  return { rooms, total: rooms.length };
};

const roomService = {
  async getRooms(hotelId, filters = {}) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get(`/hotels/${hotelId}/rooms`, { params: filters });
        if (data?.rooms?.length) return data;
      } catch (err) {
        console.info('[RoomService] Network fallback for rooms:', err.message);
      }
    }
    await delay(200);
    return filterMockRooms(hotelId, filters);
  },

  async getRoom(roomId) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get(`/rooms/${roomId}`);
        if (data?.room) return data.room;
      } catch (err) {
        console.info('[RoomService] Network fallback for single room:', err.message);
      }
    }
    await delay(150);
    const room = mockRooms.find(r => r.id === roomId) || mockRooms[0];
    return room;
  },

  async checkAvailability(roomId, checkIn, checkOut) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get(`/rooms/${roomId}/availability`, { params: { checkIn, checkOut } });
        if (data) return data;
      } catch (err) {
        console.info('[RoomService] Network fallback for availability:', err.message);
      }
    }
    await delay(200);
    const room = mockRooms.find(r => r.id === roomId);
    return { available: room?.status === 'available', roomId, checkIn, checkOut };
  },

  async updateRoomStatus(roomId, status) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.patch(`/rooms/${roomId}/status`, { status });
        if (data) return data;
      } catch (err) {
        console.info('[RoomService] Network fallback for room status update:', err.message);
      }
    }
    await delay(200);
    const room = mockRooms.find(r => r.id === roomId);
    if (room) room.status = status;
    return { success: true, roomId, status };
  },
};

export default roomService;
