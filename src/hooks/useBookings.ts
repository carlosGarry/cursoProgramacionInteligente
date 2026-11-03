import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from './useLaunches';
import { listMyBookings } from '../services/bookings.service';
import type { MyBooking } from '../types/booking';

export function useMyBookings(token: string) {
  const [state, setState] = useState<AsyncState<MyBooking[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    listMyBookings(token)
      .then((data) => active && setState({ status: 'ready', data }))
      .catch((error: Error) => active && setState({ status: 'error', error }));
    return () => {
      active = false;
    };
  }, [token, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, retry };
}
