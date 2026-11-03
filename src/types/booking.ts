export interface CreateBookingInput {
  activityId: string;
  participants: number;
}

export interface Booking {
  id: string;
  activityId: string;
  userId: string;
  participants: number;
  createdAt: string;
  paymentId: string;
  paymentStatus: string;
}
