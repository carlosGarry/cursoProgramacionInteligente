import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/http';
import { getLaunch, listLaunches } from '../services/launches.service';
import type { Launch } from '../types/activity';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: ApiError | Error };

export function useLaunches() {
  const [state, setState] = useState<AsyncState<Launch[]>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    listLaunches()
      .then((data) => active && setState({ status: 'ready', data }))
      .catch((error: Error) => active && setState({ status: 'error', error }));
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, retry };
}

export function useLaunch(id: string) {
  const [state, setState] = useState<AsyncState<Launch>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    getLaunch(id)
      .then((data) => active && setState({ status: 'ready', data }))
      .catch((error: Error) => active && setState({ status: 'error', error }));
    return () => {
      active = false;
    };
  }, [id]);

  return state;
}
