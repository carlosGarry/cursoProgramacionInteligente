import { Link } from 'react-router-dom';
import { isBookable } from '../services/launches.service';
import type { Launch } from '../types/activity';
import { Icon } from './Icon';

export function seatsLabel(launch: Launch): string {
  if (launch.availableSeats === null) return 'Plazas no disponibles';
  if (launch.status === 'sold-out' || launch.availableSeats === 0) return 'Agotado';
  return `${launch.availableSeats} plazas libres`;
}

export function LaunchCard({ launch }: { launch: Launch }) {
  return (
    <article className="launch-card" data-testid="launch-card">
      <h2>
        <Link to={`/launches/${launch.id}`}>{launch.rocket}</Link>
      </h2>
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
      {!isBookable(launch) && <span className="badge">No reservable</span>}
    </article>
  );
}
