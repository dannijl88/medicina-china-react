import { useEffect, useState } from 'react';
import {
  cancelAppointment,
  createAppointment,
  fetchMyAppointments,
  updateAppointment
} from '../api';
import { PageHero } from '../components/PageHero';

function toDatetimeLocalInput(value) {
  if (!value) {
    return '';
  }

  return value.slice(0, 16);
}

function formatDateLabel(value) {
  return new Date(value).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export function AppointmentsPage({ auth, therapies }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    serviceName: therapies[0]?.title || '',
    appointmentAt: '',
    notes: ''
  });

  useEffect(() => {
    async function loadAppointments() {
      if (!auth?.token) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const myAppointments = await fetchMyAppointments(auth.token);
        setAppointments(myAppointments);

      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [auth]);

  async function refreshAppointments() {
    if (!auth?.token) {
      return;
    }

    const myAppointments = await fetchMyAppointments(auth.token);
    setAppointments(myAppointments);
  }

  function startEdit(appointment) {
    setEditingId(appointment.id);
    setForm({
      serviceName: appointment.serviceName,
      appointmentAt: toDatetimeLocalInput(appointment.appointmentAt),
      notes: appointment.notes || ''
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      serviceName: therapies[0]?.title || '',
      appointmentAt: '',
      notes: ''
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!auth?.token) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await updateAppointment(auth.token, editingId, {
          appointmentAt: form.appointmentAt,
          notes: form.notes,
          status: 'PENDING'
        });
      } else {
        await createAppointment(auth.token, form);
      }

      await refreshAppointments();
      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(appointmentId) {
    if (!auth?.token) {
      return;
    }

    try {
      await cancelAppointment(auth.token, appointmentId);
      await refreshAppointments();
    } catch (cancelError) {
      setError(cancelError.message);
    }
  }

  if (!auth) {
    return (
      <main className="section page-section">
        <PageHero
          eyebrow="Citas"
          title="Gestiona tus reservas en un espacio privado"
          description="Para pedir, modificar o cancelar citas primero necesitas iniciar sesion."
        />
        <section className="empty-state">
          <p>Accede con tu cuenta para gestionar tus citas y hacer nuevas reservas online.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Citas"
        title="Reserva y organiza tu calendario de bienestar"
        description="Espacio privado para solicitar nuevas citas, revisar tus sesiones y modificar tus reservas."
      />

      <section className="appointments-layout">
        <article className="appointment-form-card">
          <h3>{editingId ? 'Modificar cita' : 'Solicitar una cita'}</h3>
          <p className="soft-text">
            Selecciona el servicio, la fecha y cualquier detalle que quieras compartir antes de tu sesion.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Terapia o servicio
              <select
                value={form.serviceName}
                onChange={(event) => setForm({ ...form, serviceName: event.target.value })}
              >
                {therapies.map((therapy) => (
                  <option key={therapy.title} value={therapy.title}>
                    {therapy.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Fecha y hora
              <input
                type="datetime-local"
                value={form.appointmentAt}
                onChange={(event) => setForm({ ...form, appointmentAt: event.target.value })}
              />
            </label>

            <label>
              Notas
              <textarea
                rows="5"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Escribe cualquier detalle importante sobre tu cita"
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}

            <div className="form-actions">
              <button className="button primary" disabled={submitting} type="submit">
                {submitting ? 'Guardando...' : editingId ? 'Actualizar cita' : 'Reservar cita'}
              </button>
              {editingId ? (
                <button className="button secondary" onClick={resetForm} type="button">
                  Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>
        </article>

        <article className="appointment-list-card">
          <div className="list-header">
            <h3>Mis citas</h3>
            <span>{loading ? 'Actualizando...' : `${appointments.length} registradas`}</span>
          </div>

          <div className="appointment-stack">
            {appointments.length ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div>
                    <strong>{appointment.serviceName}</strong>
                    <p>{formatDateLabel(appointment.appointmentAt)}</p>
                    <small>{appointment.notes || 'Sin notas adicionales'}</small>
                  </div>
                  <div className="appointment-meta">
                    <span className={`status-pill status-${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                    {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' ? (
                      <div className="appointment-buttons">
                        <button className="button secondary compact" onClick={() => startEdit(appointment)} type="button">
                          Editar
                        </button>
                        <button className="button secondary compact" onClick={() => handleCancel(appointment.id)} type="button">
                          Cancelar
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-inline">Todavia no tienes citas registradas.</div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
