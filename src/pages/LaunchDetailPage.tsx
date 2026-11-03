import { Link, useParams } from 'react-router-dom';
import { useLaunch } from '../hooks/useLaunches';
import { AsyncView, StatusMessage } from '../components/StatusMessage';
import { BookingForm } from '../components/BookingForm';
import { seatsLabel } from '../components/LaunchTable';
import { Icon } from '../components/Icon';
import { ApiError } from '../services/http';

export function LaunchDetailPage() {
  const { id = '' } = useParams();
  const { state, reload } = useLaunch(id);

  return (
    <section>
      <Link to="/" className="back-link">
        <Icon name="arrow-left" />
        Volver al listado
      </Link>
      {state.status === 'error' && state.error instanceof ApiError && state.error.status === 404 ? (
        <StatusMessage>Lanzamiento no encontrado.</StatusMessage>
      ) : (
        <AsyncView state={state}>
          {(launch) => (
            <article className="launch-detail">
              <h1>{launch.rocket}</h1>
              <p className="meta-row">
                <Icon name="pin" />
                {launch.location}
              </p>
              <p className="meta-row">
                <Icon name="calendar" />
                {launch.date}
              </p>
              <p className="price meta-row">
                <Icon name="tag" />
                {launch.price} €
              </p>
              <p className="seats meta-row">
                <Icon name="users" />
                {seatsLabel(launch)}
              </p>
              <BookingForm launch={launch} onBooked={reload} />
            </article>
          )}
        </AsyncView>
      )}
    </section>
  );
}
