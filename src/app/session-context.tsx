import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { clearSession, readSession, writeSession } from '../services/session';
import type { AuthResponse, Session } from '../types/auth';

interface SessionContextValue {
  session: Session | null;
  signIn: (response: AuthResponse) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  const signIn = useCallback((response: AuthResponse) => {
    const next: Session = { token: response.accessToken, user: response.user };
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return context;
}
