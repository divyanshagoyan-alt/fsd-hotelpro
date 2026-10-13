import apiClient from './apiClient';
import { mockHotels } from '../data/mock/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const filterMockHotels = (filters = {}) => {
  let hotels = [...mockHotels];
  if (filters.city) hotels = hotels.filter(h => h.city.toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.category) hotels = hotels.filter(h => h.category === filters.category);
  if (filters.minPrice) hotels = hotels.filter(h => h.priceFrom >= Number(filters.minPrice));
  if (filters.maxPrice) hotels = hotels.filter(h => h.priceFrom <= Number(filters.maxPrice));
  return { hotels, total: hotels.length };
};

const hotelService = {
  async getHotels(filters = {}) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get('/hotels', { params: filters });
        if (data?.hotels?.length) return data;
      } catch (err) {
        console.info('[HotelService] Network fallback to offline mock hotels:', err.message);
      }
    }
    await delay(200);
    return filterMockHotels(filters);
  },

  async getHotel(idOrSlug) {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get(`/hotels/${idOrSlug}`);
        if (data?.hotel) return data.hotel;
      } catch (err) {
        console.info('[HotelService] Network fallback for single hotel:', err.message);
      }
    }
    await delay(150);
    const hotel = mockHotels.find(h => h.id === idOrSlug || h.slug === idOrSlug);
    if (!hotel) return mockHotels[0];
    return hotel;
  },

  async getFeaturedHotels() {
    if (!USE_MOCK) {
      try {
        const { data } = await apiClient.get('/hotels/featured');
        if (data?.hotels?.length) return data.hotels;
      } catch (err) {
        console.info('[HotelService] Network fallback for featured hotels:', err.message);
      }
    }
    await delay(200);
    return mockHotels.slice(0, 4);
  },
};

export default hotelService;
