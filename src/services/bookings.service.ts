import { requestJson } from './http';
import type { Booking, CreateBookingInput, MyBooking, PaymentStatus } from '../types/booking';

export function createBooking(input: CreateBookingInput, token: string): Promise<Booking> {
  return requestJson<Booking>('/bookings', { method: 'POST', body: input, token });
}

export function listMyBookings(token: string): Promise<MyBooking[]> {
  return requestJson<MyBooking[]>('/bookings', { token });
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'Pagada',
  pending: 'Pendiente',
  refunded: 'Reembolsada',
};

export function paymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status];
}
