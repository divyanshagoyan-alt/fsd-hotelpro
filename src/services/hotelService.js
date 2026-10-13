import apiClient from './apiClient';
import { mockHotels } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const hotelService = {
  async getHotels(filters = {}) {
    if (USE_MOCK) {
      await delay();
      let hotels = [...mockHotels];
      if (filters.city) hotels = hotels.filter(h => h.city.toLowerCase().includes(filters.city.toLowerCase()));
      if (filters.category) hotels = hotels.filter(h => h.category === filters.category);
      if (filters.minPrice) hotels = hotels.filter(h => h.priceFrom >= Number(filters.minPrice));
      if (filters.maxPrice) hotels = hotels.filter(h => h.priceFrom <= Number(filters.maxPrice));
      return { hotels, total: hotels.length };
    }
    const { data } = await apiClient.get('/hotels', { params: filters });
    return data;
  },

  async getHotel(idOrSlug) {
    if (USE_MOCK) {
      await delay(200);
      const hotel = mockHotels.find(h => h.id === idOrSlug || h.slug === idOrSlug);
      if (!hotel) throw new Error('Hotel not found');
      return hotel;
    }
    const { data } = await apiClient.get(`/hotels/${idOrSlug}`);
    return data.hotel;
  },

  async getFeaturedHotels() {
    if (USE_MOCK) {
      await delay();
      return mockHotels.slice(0, 4);
    }
    const { data } = await apiClient.get('/hotels/featured');
    return data.hotels;
  },
};

export default hotelService;
