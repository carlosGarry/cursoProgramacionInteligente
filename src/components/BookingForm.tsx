import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../app/session-context';
import { useToast } from '../app/toast-context';
import { Icon } from './Icon';
import { createBooking } from '../services/bookings.service';
import { ApiError } from '../services/http';
import { isBookable } from '../services/launches.service';
import type { Launch } from '../types/activity';

interface BookingFormProps {
  launch: Launch;
  onBooked: () => void;
}

export function BookingForm({ launch, onBooked }: BookingFormProps) {
  const { session, signOut } = useSession();
  const { notify } = useToast();
  const maxSeats = launch.availableSeats ?? 0;
  const [participants, setParticipants] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!isBookable(launch)) {
    return <p className="status-message">Este lanzamiento no admite reservas.</p>;
  }

  if (!session) {
    return (
      <p className="status-message">
        Inicia sesión para reservar. <Link to="/login">Entrar</Link>
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    if (!Number.isInteger(participants) || participants < 1 || participants > maxSeats) {
      notify(`Elige entre 1 y ${maxSeats} plazas.`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({ activityId: launch.id, participants }, session.token);
      notify(`Reserva confirmada: ${participants} ${participants === 1 ? 'plaza' : 'plazas'}.`);
      onBooked();
    } catch (err) {
      notify(bookingErrorText(err, () => signOut()), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form" noValidate>
      <label>
        Número de plazas
        <input
          type="number"
          name="participants"
          min={1}
          max={maxSeats}
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          required
        />
      </label>
      <button type="submit" disabled={submitting}>
        <Icon name="ticket" />
        Reservar
      </button>
    </form>
  );
}

function bookingErrorText(err: unknown, onUnauthorized: () => void): string {
  if (!(err instanceof ApiError)) return 'Error inesperado';
  if (err.status === 401) {
    onUnauthorized();
    return 'Tu sesión ha caducado. Vuelve a iniciar sesión para reservar.';
  }
  if (err.status === 402) return 'No se pudo procesar el pago. Inténtalo de nuevo.';
  const fieldMessages = err.fieldErrors.map((fieldError) => fieldError.message);
  return fieldMessages.length > 0 ? fieldMessages.join(' ') : err.message;
}
