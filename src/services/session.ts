import type { Session } from '../types/auth';

const SESSION_KEY = 'astrobookings.session';

export function readSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Session> | null;
    return parsed && typeof parsed.token === 'string' && parsed.user ? (parsed as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
