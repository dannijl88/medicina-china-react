import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, registerUser } from '../api';
import { PageHero } from '../components/PageHero';

const credentialsHint = [
  { label: 'Cliente demo', value: 'cliente@medicinachina.com / Bienestar2026!' },
  { label: 'Admin demo', value: 'admin@medicinachina.com / Relax2026!' }
];

export function LoginPage({ auth, profile, setAuth, logout }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: 'cliente@medicinachina.com',
    password: 'Bienestar2026!'
  });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoadingAuth(true);
    setError('');

    try {
      const data = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await registerUser(form);

      localStorage.setItem('mc_auth', JSON.stringify(data));
      setAuth(data);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoadingAuth(false);
    }
  }

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Login"
        title="Acceso privado para clientes y administracion"
        description="Pagina independiente para entrar al area privada, crear cuenta y pasar despues a la gestion de citas."
      />

      <section className="access-section">
        <div className="access-copy">
          <span>Zona privada</span>
          <h2>Reserva, consulta y gestiona tus sesiones online</h2>
          <p>
            Desde aqui el cliente puede acceder a su espacio y gestionar sus citas, mientras administracion controla
            toda la agenda.
          </p>

          <div className="credentials-box">
            <p>Credenciales de ejemplo</p>
            {credentialsHint.map((item) => (
              <div key={item.label}>
                <strong>{item.label}:</strong> <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-card">
          {!auth ? (
            <>
              <div className="auth-switch">
                <button
                  className={`mode-pill ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => setMode('login')}
                  type="button"
                >
                  Iniciar sesion
                </button>
                <button
                  className={`mode-pill ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => setMode('register')}
                  type="button"
                >
                  Crear cuenta
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <h3>{mode === 'login' ? 'Accede a tu espacio' : 'Crea tu cuenta'}</h3>

                {mode === 'register' ? (
                  <>
                    <label>
                      Nombre completo
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                        placeholder="Tu nombre"
                      />
                    </label>
                    <label>
                      Telefono
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder="600123456"
                      />
                    </label>
                  </>
                ) : null}

                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="tu@email.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    placeholder="********"
                  />
                </label>
                {error ? <p className="error-text">{error}</p> : null}
                <button className="button primary full" disabled={loadingAuth} type="submit">
                  {loadingAuth ? 'Procesando...' : mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
                </button>
              </form>
            </>
          ) : (
            <div className="profile-panel">
              <h3>Bienvenida, {profile?.displayName || auth.displayName}</h3>
              <p>{profile?.username || auth.username}</p>
              <div className="benefits-list">
                {(profile?.benefits || []).map((benefit) => (
                  <div key={benefit} className="benefit-item">{benefit}</div>
                ))}
              </div>
              <Link className="button primary full" to="/citas">
                Ir a mis citas
              </Link>
              <button className="button secondary full" onClick={logout} type="button">
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
