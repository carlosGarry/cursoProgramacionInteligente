import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../services/http';
import { register } from '../services/auth.service';
import { useSession } from '../app/session-context';
import { useToast } from '../app/toast-context';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const { notify } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await register({ username, email, password, terms });
      signIn(response);
      notify(`Cuenta creada. Bienvenido, ${response.user.username}.`);
      navigate('/');
    } catch (err) {
      notify(registerErrorText(err), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-form-section">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Nombre de usuario
          <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Contraseña
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>

        <label className="checkbox">
          <input type="checkbox" name="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          Acepto los términos y condiciones
        </label>

        <button type="submit" disabled={submitting}>Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}

function registerErrorText(err: unknown): string {
  if (err instanceof ApiError && err.fieldErrors.length > 0) {
    return err.fieldErrors.map((fieldError) => fieldError.message).join(' ');
  }
  return err instanceof Error ? err.message : 'Error inesperado';
}
