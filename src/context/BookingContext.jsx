import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

const initialState = {
  hotelId: null,
  hotelName: '',
  roomId: null,
  roomName: '',
  roomImage: '',
  pricePerNight: 0,
  checkIn: '',
  checkOut: '',
  nights: 0,
  guests: 1,
  guestInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  },
  step: 1, // 1=search, 2=room, 3=info, 4=review, 5=payment
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(initialState);

  const updateBooking = useCallback((updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(initialState);
  }, []);

  const calculateNights = useCallback((checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const subtotal = booking.pricePerNight * booking.nights;
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAmount;

  return (
    <BookingContext.Provider value={{
      booking,
      updateBooking,
      resetBooking,
      calculateNights,
      subtotal,
      taxAmount,
      totalAmount,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
