import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSession } from '../app/session-context';
import { AsyncView } from '../components/StatusMessage';
import { useMyBookings } from '../hooks/useBookings';
import { paymentStatusLabel } from '../services/bookings.service';
import { ApiError } from '../services/http';
import { Icon } from '../components/Icon';

export function MyBookingsPage() {
  const { session, signOut } = useSession();
  const token = session?.token ?? '';
  const { state, retry } = useMyBookings(token);
  const unauthorized = state.status === 'error' && state.error instanceof ApiError && state.error.status === 401;

  useEffect(() => {
    if (unauthorized) signOut();
  }, [unauthorized, signOut]);

  if (unauthorized) return <Navigate to="/login" replace />;

  return (
    <section>
      <h1 className="page-title">
        <Icon name="ticket" />
        Mis reservas
      </h1>
      <AsyncView state={state} onRetry={retry}>
        {(bookings) =>
          bookings.length === 0 ? (
            <p className="status-message">
              Todavía no tienes reservas. <Link to="/">Ver lanzamientos</Link>
            </p>
          ) : (
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th scope="col">Lanzamiento</th>
                    <th scope="col">Lugar</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Plazas</th>
                    <th scope="col">Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} data-testid="booking-row">
                      <td data-label="Lanzamiento" className="booking-name">{booking.activity.name}</td>
                      <td data-label="Lugar">{booking.activity.location}</td>
                      <td data-label="Fecha">{booking.activity.date}</td>
                      <td data-label="Plazas">{booking.participants}</td>
                      <td data-label="Pago">
                        <span className={`payment-badge payment-${booking.paymentStatus}`}>
                          <Icon name="card" />
                          {paymentStatusLabel(booking.paymentStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </AsyncView>
    </section>
  );
}
