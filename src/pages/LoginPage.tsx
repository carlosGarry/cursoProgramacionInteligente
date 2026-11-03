import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useSession } from '../app/session-context';
import { useToast } from '../app/toast-context';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await login({ email, password });
      signIn(response);
      notify(`Sesión iniciada como ${response.user.username}.`);
      navigate('/');
    } catch (err) {
      notify(errorText(err), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-form-section">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={submitting}>Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </section>
  );
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : 'Error inesperado';
}
