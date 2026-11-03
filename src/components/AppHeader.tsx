import { Link } from 'react-router-dom';
import { useSession } from '../app/session-context';

export function AppHeader() {
  const { session, signOut } = useSession();

  return (
    <header className="app-header">
      <Link to="/" className="brand">AstroBookings</Link>
      <nav>
        {session ? (
          <>
            <span>Hola, {session.user.username}</span>
            <button type="button" onClick={signOut}>Salir</button>
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
