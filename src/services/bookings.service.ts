import { requestJson } from './http';
import type { Booking, CreateBookingInput } from '../types/booking';

export function createBooking(input: CreateBookingInput, token: string): Promise<Booking> {
  return requestJson<Booking>('/bookings', { method: 'POST', body: input, token });
}
