export type ActivityStatus =
  | 'published'
  | 'confirmed'
  | 'sold-out'
  | 'done'
  | 'cancelled'
  | 'draft';

export interface Activity {
  id: string;
  name: string;
  slug: string;
  price: number;
  date: string;
  duration: number;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  status: ActivityStatus;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Availability {
  activityId: string;
  maxParticipants: number;
  bookedParticipants: number;
  availableSeats: number;
}

export interface Launch {
  id: string;
  rocket: string;
  price: number;
  date: string;
  location: string;
  status: ActivityStatus;
  availableSeats: number | null;
}
