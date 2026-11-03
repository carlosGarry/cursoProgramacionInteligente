import { ApiError, getJson } from './http';
import type { Activity, ActivityStatus, Availability, Launch } from '../types/activity';

const LISTED_STATUSES: ActivityStatus[] = ['published', 'confirmed', 'sold-out'];
const BOOKABLE_STATUSES: ActivityStatus[] = ['published', 'confirmed'];

export function isListedStatus(status: ActivityStatus): boolean {
  return LISTED_STATUSES.includes(status);
}

export function isBookable(launch: Pick<Launch, 'status' | 'availableSeats'>): boolean {
  return BOOKABLE_STATUSES.includes(launch.status) && launch.availableSeats !== 0;
}

export async function getAvailableSeats(activityId: string): Promise<number> {
  const availability = await getJson<Availability>(`/activities/${activityId}/availability`);
  return availability.availableSeats;
}

function toLaunch(activity: Activity, availableSeats: number | null): Launch {
  return {
    id: activity.id,
    rocket: activity.name,
    price: activity.price,
    date: activity.date,
    location: activity.location,
    status: activity.status,
    availableSeats,
  };
}

export async function listLaunches(): Promise<Launch[]> {
  const activities = await getJson<Activity[]>('/activities');
  const listed = activities.filter((activity) => isListedStatus(activity.status));

  const seats = await Promise.allSettled(listed.map((activity) => getAvailableSeats(activity.id)));

  return listed.map((activity, index) => {
    const result = seats[index];
    const availableSeats = result.status === 'fulfilled' ? result.value : null;
    return toLaunch(activity, availableSeats);
  });
}

export async function getLaunch(id: string): Promise<Launch> {
  const activity = await getJson<Activity>(`/activities/${id}`);
  if (!isListedStatus(activity.status)) {
    throw new ApiError(404, `Launch ${id} is not available`);
  }
  const availableSeats = await getAvailableSeats(id);
  return toLaunch(activity, availableSeats);
}
