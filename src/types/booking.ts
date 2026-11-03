export interface CreateBookingInput {
  activityId: string;
  participants: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  activityId: string;
  userId: string;
  participants: number;
  createdAt: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
}

export interface BookingActivity {
  name: string;
  slug: string;
  price: number;
  date: string;
  duration: number;
  location: string;
  status: string;
}

export interface MyBooking extends Booking {
  activity: BookingActivity;
}
