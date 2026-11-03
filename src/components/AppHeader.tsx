import { Link } from 'react-router-dom';
import { useSession } from '../app/session-context';
import { useToast } from '../app/toast-context';
import { Icon } from './Icon';

export function AppHeader() {
  const { session, signOut } = useSession();
  const { notify } = useToast();

  function handleSignOut() {
    signOut();
    notify('Has cerrado sesión.');
  }

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <Icon name="rocket" />
        AstroBookings
      </Link>
      <nav>
        {session ? (
          <>
            <span>
              <Icon name="user" />
              Hola, {session.user.username}
            </span>
            <Link to="/bookings">
              <Icon name="ticket" />
              Mis reservas
            </Link>
            <button type="button" onClick={handleSignOut}>
              <Icon name="logout" />
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Icon name="login" />
              Entrar
            </Link>
            <Link to="/register">
              <Icon name="user-plus" />
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
