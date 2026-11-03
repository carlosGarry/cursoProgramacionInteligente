import { Link, useParams } from 'react-router-dom';
import { useLaunch } from '../hooks/useLaunches';
import { AsyncView, StatusMessage } from '../components/StatusMessage';
import { seatsLabel } from '../components/LaunchCard';
import { isBookable } from '../services/launches.service';
import { ApiError } from '../services/http';

export function LaunchDetailPage() {
  const { id = '' } = useParams();
  const state = useLaunch(id);

  return (
    <section>
      <Link to="/">← Volver al listado</Link>
      {state.status === 'error' && state.error instanceof ApiError && state.error.status === 404 ? (
        <StatusMessage>Lanzamiento no encontrado.</StatusMessage>
      ) : (
        <AsyncView state={state}>
          {(launch) => (
            <article className="launch-detail">
              <h1>{launch.rocket}</h1>
              <p>{launch.location}</p>
              <p>{launch.date}</p>
              <p className="price">{launch.price} €</p>
              <p className="seats">{seatsLabel(launch)}</p>
              <button type="button" disabled={!isBookable(launch)}>
                Reservar
              </button>
            </article>
          )}
        </AsyncView>
      )}
    </section>
  );
}
