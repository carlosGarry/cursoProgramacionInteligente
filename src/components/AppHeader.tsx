import { Link } from 'react-router-dom';
import { useSession } from '../app/session-context';
import { useToast } from '../app/toast-context';

export function AppHeader() {
  const { session, signOut } = useSession();
  const { notify } = useToast();

  function handleSignOut() {
    signOut();
    notify('Has cerrado sesión.');
  }

  return (
    <header className="app-header">
      <Link to="/" className="brand">AstroBookings</Link>
      <nav>
        {session ? (
          <>
            <span>Hola, {session.user.username}</span>
            <Link to="/bookings">Mis reservas</Link>
            <button type="button" onClick={handleSignOut}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}
