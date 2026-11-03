import { useNavigate } from 'react-router-dom';
import { isBookable } from '../services/launches.service';
import type { Launch } from '../types/activity';
import { Icon } from './Icon';

export function seatsLabel(launch: Launch): string {
  if (launch.availableSeats === null) return 'Plazas no disponibles';
  if (launch.status === 'sold-out' || launch.availableSeats === 0) return 'Agotado';
  return `${launch.availableSeats} plazas libres`;
}

export function LaunchTable({ launches }: { launches: Launch[] }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <table className="launches-table">
        <thead>
          <tr>
            <th>Lanzamiento</th>
            <th>Lugar</th>
            <th>Fecha</th>
            <th>Precio</th>
            <th>Plazas</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {launches.map((launch) => (
            <tr key={launch.id} data-testid="launch-row">
              <td data-label="Lanzamiento" className="launch-name">{launch.rocket}</td>
              <td data-label="Lugar">
                <span className="meta-row">
                  <Icon name="pin" />
                  {launch.location}
                </span>
              </td>
              <td data-label="Fecha">
                <span className="meta-row">
                  <Icon name="calendar" />
                  {launch.date}
                </span>
              </td>
              <td data-label="Precio">
                <span className="meta-row">
                  <Icon name="tag" />
                  {launch.price} €
                </span>
              </td>
              <td data-label="Plazas">
                <span className="meta-row">
                  <Icon name="users" />
                  {seatsLabel(launch)}
                </span>
              </td>
              <td data-label="Acción" className="action-cell">
                {isBookable(launch) ? (
                  <button
                    type="button"
                    aria-label={`Reservar ${launch.rocket}`}
                    onClick={() => navigate(`/launches/${launch.id}`)}
                  >
                    <Icon name="ticket" />
                    Reservar
                  </button>
                ) : (
                  <span className="badge">No reservable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
