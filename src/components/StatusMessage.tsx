import type { AsyncState } from '../hooks/useLaunches';
import { ApiError } from '../services/http';
import type { ReactNode } from 'react';

export function StatusMessage({ children }: { children: ReactNode }) {
  return <p className="status-message">{children}</p>;
}

export function ErrorMessage({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  const message =
    error instanceof ApiError && error.status === 0
      ? 'No se pudo conectar con la API. Comprueba que está en marcha.'
      : 'Ha ocurrido un error al cargar los datos.';
  return (
    <div role="alert" className="status-message">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function AsyncView<T>({
  state,
  onRetry,
  children,
}: {
  state: AsyncState<T>;
  onRetry?: () => void;
  children: (data: T) => ReactNode;
}) {
  if (state.status === 'loading') return <StatusMessage>Cargando lanzamientos…</StatusMessage>;
  if (state.status === 'error') return <ErrorMessage error={state.error} onRetry={onRetry} />;
  return <>{children(state.data)}</>;
}
