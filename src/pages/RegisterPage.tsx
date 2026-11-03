import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, type FieldError } from '../services/http';
import { register } from '../services/auth.service';
import { useSession } from '../app/session-context';

export function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors([]);
    try {
      signIn(await register({ username, email, password, terms }));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setFieldErrors(err instanceof ApiError ? err.fieldErrors : []);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldError = (name: string) => fieldErrors.find((item) => item.field === name)?.message;

  return (
    <section className="auth-form-section">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Nombre de usuario
          <input name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        {fieldError('username') && <p className="form-error">{fieldError('username')}</p>}

        <label>
          Email
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {fieldError('email') && <p className="form-error">{fieldError('email')}</p>}

        <label>
          Contraseña
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>
        {fieldError('password') && <p className="form-error">{fieldError('password')}</p>}

        <label className="checkbox">
          <input type="checkbox" name="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          Acepto los términos y condiciones
        </label>
        {fieldError('terms') && <p className="form-error">{fieldError('terms')}</p>}

        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" disabled={submitting}>Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}
