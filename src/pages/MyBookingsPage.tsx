import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSession } from '../app/session-context';
import { AsyncView } from '../components/StatusMessage';
import { useMyBookings } from '../hooks/useBookings';
import { paymentStatusLabel } from '../services/bookings.service';
import { ApiError } from '../services/http';

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
      <h1>Mis reservas</h1>
      <AsyncView state={state} onRetry={retry}>
        {(bookings) =>
          bookings.length === 0 ? (
            <p className="status-message">
              Todavía no tienes reservas. <Link to="/">Ver lanzamientos</Link>
            </p>
          ) : (
            <ul className="booking-list">
              {bookings.map((booking) => (
                <li key={booking.id} className="booking-card" data-testid="booking-card">
                  <h2>{booking.activity.name}</h2>
                  <p>{booking.activity.location}</p>
                  <p>{booking.activity.date}</p>
                  <p>{booking.participants} {booking.participants === 1 ? 'plaza' : 'plazas'}</p>
                  <p className="booking-status">Pago: {paymentStatusLabel(booking.paymentStatus)}</p>
                </li>
              ))}
            </ul>
          )
        }
      </AsyncView>
    </section>
  );
}
