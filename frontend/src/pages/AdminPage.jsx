import { useEffect, useMemo, useState } from 'react';
import {
  createAdminTraining,
  createCatalogItem,
  deleteAdminAppointment,
  deleteAdminTraining,
  deleteAdminUser,
  deleteCatalogItem,
  fetchAdminCatalogItems,
  fetchAdminTrainings,
  fetchAdminUsers,
  fetchAllAdminReviews,
  fetchAllAppointments,
  updateAdminTraining,
  updateAppointmentStatus,
  updateCatalogItem,
  updateReviewStatus
} from '../api';
import { PageHero } from '../components/PageHero';

const catalogTypes = ['THERAPY', 'WORKSHOP', 'PRODUCT'];
const reviewStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
const appointmentStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const sections = [
  { key: 'overview', label: 'Resumen' },
  { key: 'catalog', label: 'Catálogo' },
  { key: 'trainings', label: 'Formaciones' },
  { key: 'appointments', label: 'Citas' },
  { key: 'reviews', label: 'Reseñas' },
  { key: 'users', label: 'Usuarios' }
];

const catalogTypeLabels = {
  THERAPY: 'Terapias',
  WORKSHOP: 'Talleres',
  PRODUCT: 'Productos'
};

const appointmentStatusLabels = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada'
};

const reviewStatusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada'
};

const reviewTypeLabels = {
  THERAPY: 'Terapia',
  WORKSHOP: 'Taller',
  PRODUCT: 'Producto',
  TRAINING: 'Formación'
};

const emptyCatalogForm = {
  type: 'THERAPY',
  title: '',
  slug: '',
  description: '',
  metaPrimary: '',
  metaSecondary: '',
  sortOrder: 0,
  active: true
};

const emptyTrainingForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  priceCents: 0,
  currency: 'eur',
  durationLabel: '',
  modality: 'Descargable',
  level: 'Inicial',
  syllabus: '',
  downloadFilePath: '',
  active: true
};

function formatDate(value) {
  return new Date(value).toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function buildSummaryCards({ catalogItems, trainings, appointments, reviews, users }) {
  return [
    { title: 'Elementos', value: catalogItems.length, note: 'catálogo visible o editable' },
    { title: 'Formaciones', value: trainings.length, note: 'cursos disponibles' },
    { title: 'Citas', value: appointments.length, note: 'agenda global' },
    { title: 'Reseñas', value: reviews.length, note: 'pendientes y publicadas' },
    { title: 'Usuarios', value: users.length, note: 'cuentas registradas' }
  ];
}

async function loadSectionData(section, token, catalogType) {
  switch (section) {
    case 'overview': {
      const results = await Promise.allSettled([
        fetchAdminCatalogItems(token, catalogType),
        fetchAdminTrainings(token),
        fetchAllAppointments(token),
        fetchAllAdminReviews(token),
        fetchAdminUsers(token)
      ]);

      const [catalogResult, trainingsResult, appointmentsResult, reviewsResult, usersResult] = results;
      const errors = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason?.message)
        .filter(Boolean);

      return {
        catalogItems: catalogResult.status === 'fulfilled' ? catalogResult.value : [],
        trainings: trainingsResult.status === 'fulfilled' ? trainingsResult.value : [],
        appointments: appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [],
        reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : [],
        users: usersResult.status === 'fulfilled' ? usersResult.value : [],
        error: errors[0] || ''
      };
    }
    case 'catalog':
      return { catalogItems: await fetchAdminCatalogItems(token, catalogType), error: '' };
    case 'trainings':
      return { trainings: await fetchAdminTrainings(token), error: '' };
    case 'appointments':
      return { appointments: await fetchAllAppointments(token), error: '' };
    case 'reviews':
      return { reviews: await fetchAllAdminReviews(token), error: '' };
    case 'users':
      return { users: await fetchAdminUsers(token), error: '' };
    default:
      return { error: '' };
  }
}

export function AdminPage({ auth, profile }) {
  const [section, setSection] = useState('overview');
  const [catalogType, setCatalogType] = useState('THERAPY');
  const [catalogItems, setCatalogItems] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingCatalogId, setEditingCatalogId] = useState(null);
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [catalogForm, setCatalogForm] = useState(emptyCatalogForm);
  const [catalogImageFile, setCatalogImageFile] = useState(null);
  const [catalogImagePreview, setCatalogImagePreview] = useState('');
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingForm, setTrainingForm] = useState(emptyTrainingForm);
  const [trainingImageFile, setTrainingImageFile] = useState(null);
  const [trainingImagePreview, setTrainingImagePreview] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = useMemo(() => (profile?.roles || auth?.roles || []).includes('ROLE_ADMIN'), [auth, profile]);

  useEffect(() => {
    if (!auth?.token || !isAdmin) {
      return;
    }

    let isMounted = true;

    async function loadCurrentSection() {
      setIsLoading(true);
      setError('');

      try {
        const data = await loadSectionData(section, auth.token, catalogType);
        if (!isMounted) {
          return;
        }

        if (data.catalogItems) {
          setCatalogItems(data.catalogItems);
        }
        if (data.trainings) {
          setTrainings(data.trainings);
        }
        if (data.appointments) {
          setAppointments(data.appointments);
        }
        if (data.reviews) {
          setReviews(data.reviews);
        }
        if (data.users) {
          setUsers(data.users);
        }
        setError(data.error || '');
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCurrentSection();

    return () => {
      isMounted = false;
    };
  }, [auth?.token, isAdmin, section, catalogType]);

  if (!auth || !isAdmin) {
    return (
      <main className="section page-section">
        <PageHero
          eyebrow="Admin"
          title="Panel de administración"
          description="Esta zona está reservada a usuarios con rol administrador."
        />
        <div className="empty-state">No tienes permisos para acceder al panel de administración.</div>
      </main>
    );
  }

  async function refreshSection(targetSection = section) {
    setIsLoading(true);
    setError('');
    try {
      const data = await loadSectionData(targetSection, auth.token, catalogType);
      if (data.catalogItems) {
        setCatalogItems(data.catalogItems);
      }
      if (data.trainings) {
        setTrainings(data.trainings);
      }
      if (data.appointments) {
        setAppointments(data.appointments);
      }
      if (data.reviews) {
        setReviews(data.reviews);
      }
      if (data.users) {
        setUsers(data.users);
      }
      setError(data.error || '');
    } catch (refreshError) {
      setError(refreshError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCatalogImageChange(event) {
    const file = event.target.files?.[0] || null;
    setCatalogImageFile(file);
    setCatalogImagePreview(file ? URL.createObjectURL(file) : '');
  }

  function handleTrainingImageChange(event) {
    const file = event.target.files?.[0] || null;
    setTrainingImageFile(file);
    setTrainingImagePreview(file ? URL.createObjectURL(file) : '');
  }

  function startCatalogEdit(item) {
    setEditingCatalogId(item.id);
    setShowCatalogForm(true);
    setCatalogForm({
      type: item.type,
      title: item.title,
      slug: item.slug,
      description: item.description,
      metaPrimary: item.metaPrimary || '',
      metaSecondary: item.metaSecondary || '',
      sortOrder: item.sortOrder || 0,
      active: item.active
    });
    setCatalogImageFile(null);
    setCatalogImagePreview(item.imageUrl || '');
  }

  function resetCatalogForm() {
    setEditingCatalogId(null);
    setShowCatalogForm(false);
    setCatalogForm({ ...emptyCatalogForm, type: catalogType });
    setCatalogImageFile(null);
    setCatalogImagePreview('');
  }

  function startTrainingEdit(training) {
    setEditingTrainingId(training.id);
    setShowTrainingForm(true);
    setTrainingForm({
      title: training.title,
      slug: training.slug,
      summary: training.summary,
      description: training.description,
      priceCents: training.priceCents,
      currency: training.currency,
      durationLabel: training.durationLabel,
      modality: training.modality,
      level: training.level,
      syllabus: training.syllabus.join('|'),
      downloadFilePath: training.downloadFilePath,
      active: training.active
    });
    setTrainingImageFile(null);
    setTrainingImagePreview(training.imageUrl || '');
  }

  function resetTrainingForm() {
    setEditingTrainingId(null);
    setShowTrainingForm(false);
    setTrainingForm(emptyTrainingForm);
    setTrainingImageFile(null);
    setTrainingImagePreview('');
  }

  async function handleCatalogSubmit(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    try {
      const payload = { ...catalogForm, image: catalogImageFile };
      if (editingCatalogId) {
        await updateCatalogItem(auth.token, editingCatalogId, payload);
        setInfo('Elemento del catálogo actualizado.');
      } else {
        await createCatalogItem(auth.token, payload);
        setInfo('Elemento del catálogo creado.');
      }
      await refreshSection('catalog');
      resetCatalogForm();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleTrainingSubmit(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    try {
      const payload = {
        ...trainingForm,
        priceCents: Number(trainingForm.priceCents),
        image: trainingImageFile
      };
      if (editingTrainingId) {
        await updateAdminTraining(auth.token, editingTrainingId, payload);
        setInfo('Formación actualizada.');
      } else {
        await createAdminTraining(auth.token, payload);
        setInfo('Formación creada.');
      }
      await refreshSection('trainings');
      resetTrainingForm();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  const cards = buildSummaryCards({ catalogItems, trainings, appointments, reviews, users });

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Admin"
        title="Panel de administración"
        description="Gestiona catálogo, formaciones, citas, reseñas y usuarios desde un espacio unificado."
      />

      <section className="admin-layout">
        <aside className="admin-panel-nav">
          <div className="admin-panel-brand">
            <span className="eyebrow">Gestión</span>
            <h2>Control interno</h2>
            <p className="soft-text">Ahora puedes subir imágenes directamente desde el panel y quedan guardadas en el backend.</p>
          </div>
          <div className="admin-panel-tabs">
            {sections.map((item) => (
              <button
                key={item.key}
                className={`admin-tab ${section === item.key ? 'active' : ''}`}
                onClick={() => {
                  setSection(item.key);
                  setInfo('');
                  setError('');
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="admin-panel-content">
          {isLoading ? <p className="soft-text">Cargando datos...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
          {info ? <p className="soft-text">{info}</p> : null}

          {section === 'overview' ? (
            <section className="admin-summary-grid">
              {cards.map((card) => (
                <article key={card.title} className="preview-card admin-stat-card">
                  <span className="eyebrow">{card.title}</span>
                  <h3>{card.value}</h3>
                  <p>{card.note}</p>
                </article>
              ))}
            </section>
          ) : null}

          {section === 'catalog' ? (
            <section className="admin-workspace">
              <article className="appointment-list-card">
                <div className="admin-section-head">
                  <div>
                    <span className="eyebrow">Listado</span>
                    <h3>{catalogTypeLabels[catalogType]}</h3>
                  </div>
                  <div className="appointment-buttons">
                    <label className="status-editor">
                      Tipo
                      <select
                        value={catalogType}
                        onChange={(event) => {
                          const nextType = event.target.value;
                          setCatalogType(nextType);
                          setCatalogForm((current) => ({ ...current, type: nextType }));
                          setEditingCatalogId(null);
                          setShowCatalogForm(false);
                        }}
                      >
                        {catalogTypes.map((type) => (
                          <option key={type} value={type}>{catalogTypeLabels[type]}</option>
                        ))}
                      </select>
                    </label>
                    <button className="button primary compact" onClick={() => setShowCatalogForm(true)} type="button">
                      Añadir nuevo
                    </button>
                  </div>
                </div>
                <p className="soft-text">{catalogItems.length} registros</p>
                <div className="appointment-stack">
                  {catalogItems.map((item) => (
                    <div key={item.id} className="admin-row-card">
                      <div className="admin-row-copy">
                        <strong>{item.title}</strong>
                        <p>{item.slug}</p>
                        <small>{item.metaPrimary || 'Sin meta principal'}{item.metaSecondary ? ` | ${item.metaSecondary}` : ''}</small>
                      </div>
                      {item.imageUrl ? <img alt={item.title} className="admin-row-thumb" src={item.imageUrl} /> : null}
                      <div className="appointment-buttons">
                        <button className="button secondary compact" onClick={() => startCatalogEdit(item)} type="button">Editar</button>
                        <button className="button secondary compact" onClick={async () => {
                          try {
                            setError('');
                            await deleteCatalogItem(auth.token, item.id);
                            setInfo('Elemento eliminado.');
                            await refreshSection('catalog');
                          } catch (actionError) {
                            setError(actionError.message);
                          }
                        }} type="button">Borrar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {showCatalogForm ? (
                <article className="auth-card">
                  <div className="admin-section-head">
                    <div>
                      <span className="eyebrow">Catálogo</span>
                      <h3>{editingCatalogId ? 'Editar elemento' : 'Nuevo elemento'}</h3>
                    </div>
                  </div>

                  <form className="contact-form" onSubmit={handleCatalogSubmit}>
                    <label>Título<input value={catalogForm.title} onChange={(event) => setCatalogForm({ ...catalogForm, title: event.target.value })} /></label>
                    <label>Slug<input value={catalogForm.slug} onChange={(event) => setCatalogForm({ ...catalogForm, slug: event.target.value })} /></label>
                    <label>Descripción<textarea value={catalogForm.description} onChange={(event) => setCatalogForm({ ...catalogForm, description: event.target.value })} /></label>
                    <label>Imagen<input accept="image/*" onChange={handleCatalogImageChange} type="file" /></label>
                    {catalogImagePreview ? <img alt="Vista previa del catálogo" className="admin-image-preview" src={catalogImagePreview} /> : null}
                    <label>Meta principal<input value={catalogForm.metaPrimary} onChange={(event) => setCatalogForm({ ...catalogForm, metaPrimary: event.target.value })} /></label>
                    <label>Meta secundaria<input value={catalogForm.metaSecondary} onChange={(event) => setCatalogForm({ ...catalogForm, metaSecondary: event.target.value })} /></label>
                    <label>Orden<input type="number" value={catalogForm.sortOrder} onChange={(event) => setCatalogForm({ ...catalogForm, sortOrder: Number(event.target.value) })} /></label>
                    <label className="checkbox-row"><input type="checkbox" checked={catalogForm.active} onChange={(event) => setCatalogForm({ ...catalogForm, active: event.target.checked })} /><span>Activo</span></label>
                    <div className="hero-actions">
                      <button className="button primary" type="submit">{editingCatalogId ? 'Guardar cambios' : 'Crear elemento'}</button>
                      <button className="button secondary" onClick={resetCatalogForm} type="button">Cancelar</button>
                    </div>
                  </form>
                </article>
              ) : null}
            </section>
          ) : null}

          {section === 'trainings' ? (
            <section className="admin-workspace">
              <article className="appointment-list-card">
                <div className="admin-section-head">
                  <div>
                    <span className="eyebrow">Listado</span>
                    <h3>Formaciones</h3>
                  </div>
                  <button className="button primary compact" onClick={() => setShowTrainingForm(true)} type="button">
                    Añadir nueva
                  </button>
                </div>
                <p className="soft-text">{trainings.length} registros</p>
                <div className="appointment-stack">
                  {trainings.map((training) => (
                    <div key={training.id} className="admin-row-card">
                      <div className="admin-row-copy">
                        <strong>{training.title}</strong>
                        <p>{training.slug}</p>
                        <small>{training.modality} | {training.level} | {training.active ? 'Activa' : 'Oculta'}</small>
                      </div>
                      {training.imageUrl ? <img alt={training.title} className="admin-row-thumb" src={training.imageUrl} /> : null}
                      <div className="appointment-buttons">
                        <button className="button secondary compact" onClick={() => startTrainingEdit(training)} type="button">Editar</button>
                        <button className="button secondary compact" onClick={async () => {
                          try {
                            setError('');
                            await deleteAdminTraining(auth.token, training.id);
                            setInfo('Formación eliminada.');
                            await refreshSection('trainings');
                          } catch (actionError) {
                            setError(actionError.message);
                          }
                        }} type="button">Borrar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {showTrainingForm ? (
                <article className="auth-card">
                  <div className="admin-section-head">
                    <div>
                      <span className="eyebrow">Formaciones</span>
                      <h3>{editingTrainingId ? 'Editar formación' : 'Nueva formación'}</h3>
                    </div>
                  </div>
                  <form className="contact-form" onSubmit={handleTrainingSubmit}>
                    <label>Título<input value={trainingForm.title} onChange={(event) => setTrainingForm({ ...trainingForm, title: event.target.value })} /></label>
                    <label>Slug<input value={trainingForm.slug} onChange={(event) => setTrainingForm({ ...trainingForm, slug: event.target.value })} /></label>
                    <label>Resumen<input value={trainingForm.summary} onChange={(event) => setTrainingForm({ ...trainingForm, summary: event.target.value })} /></label>
                    <label>Descripción<textarea value={trainingForm.description} onChange={(event) => setTrainingForm({ ...trainingForm, description: event.target.value })} /></label>
                    <label>Imagen<input accept="image/*" onChange={handleTrainingImageChange} type="file" /></label>
                    {trainingImagePreview ? <img alt="Vista previa de la formación" className="admin-image-preview" src={trainingImagePreview} /> : null}
                    <label>Precio en céntimos<input type="number" value={trainingForm.priceCents} onChange={(event) => setTrainingForm({ ...trainingForm, priceCents: Number(event.target.value) })} /></label>
                    <label>Duración<input value={trainingForm.durationLabel} onChange={(event) => setTrainingForm({ ...trainingForm, durationLabel: event.target.value })} /></label>
                    <label>Modalidad<input value={trainingForm.modality} onChange={(event) => setTrainingForm({ ...trainingForm, modality: event.target.value })} /></label>
                    <label>Nivel<input value={trainingForm.level} onChange={(event) => setTrainingForm({ ...trainingForm, level: event.target.value })} /></label>
                    <label>Temario (separa por |)<textarea value={trainingForm.syllabus} onChange={(event) => setTrainingForm({ ...trainingForm, syllabus: event.target.value })} /></label>
                    <label>Archivo de descarga<input value={trainingForm.downloadFilePath} onChange={(event) => setTrainingForm({ ...trainingForm, downloadFilePath: event.target.value })} /></label>
                    <label className="checkbox-row"><input type="checkbox" checked={trainingForm.active} onChange={(event) => setTrainingForm({ ...trainingForm, active: event.target.checked })} /><span>Activa</span></label>
                    <div className="hero-actions">
                      <button className="button primary" type="submit">{editingTrainingId ? 'Guardar cambios' : 'Crear formación'}</button>
                      <button className="button secondary" onClick={resetTrainingForm} type="button">Cancelar</button>
                    </div>
                  </form>
                </article>
              ) : null}
            </section>
          ) : null}

          {section === 'appointments' ? (
            <section className="appointment-list-card">
              <div className="admin-section-head">
                <div>
                  <span className="eyebrow">Agenda</span>
                  <h3>Citas</h3>
                </div>
                <span className="soft-text">{appointments.length} registros</span>
              </div>
              <div className="appointment-stack">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="admin-row-card">
                    <div className="admin-row-copy">
                      <strong>{appointment.customerName}</strong>
                      <p>{appointment.customerEmail}</p>
                      <small>{appointment.serviceName} | {formatDate(appointment.appointmentAt)}</small>
                    </div>
                    <div className="appointment-buttons">
                      <select value={appointment.status} onChange={async (event) => {
                        try {
                          setError('');
                          await updateAppointmentStatus(auth.token, appointment.id, event.target.value);
                          setInfo('Estado de la cita actualizado.');
                          await refreshSection('appointments');
                        } catch (actionError) {
                          setError(actionError.message);
                        }
                      }}>
                        {appointmentStatuses.map((status) => (
                          <option key={status} value={status}>{appointmentStatusLabels[status]}</option>
                        ))}
                      </select>
                      <button className="button secondary compact" onClick={async () => {
                        try {
                          setError('');
                          await deleteAdminAppointment(auth.token, appointment.id);
                          setInfo('Cita eliminada.');
                          await refreshSection('appointments');
                        } catch (actionError) {
                          setError(actionError.message);
                        }
                      }} type="button">Borrar</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {section === 'reviews' ? (
            <section className="appointment-list-card">
              <div className="admin-section-head">
                <div>
                  <span className="eyebrow">Moderación</span>
                  <h3>Reseñas</h3>
                </div>
                <span className="soft-text">{reviews.length} registros</span>
              </div>
              <div className="appointment-stack">
                {reviews.map((review) => (
                  <div key={review.id} className="admin-row-card">
                    <div className="admin-row-copy">
                      <strong>{review.itemLabel}</strong>
                      <p>{review.authorName} | {review.rating}/5 | {reviewTypeLabels[review.reviewableType] || review.reviewableType}</p>
                      <small>{review.title} | {review.comment}</small>
                    </div>
                    <div className="appointment-buttons">
                      <select value={review.status} onChange={async (event) => {
                        try {
                          setError('');
                          await updateReviewStatus(auth.token, review.id, event.target.value);
                          setInfo('Estado de la reseña actualizado.');
                          await refreshSection('reviews');
                        } catch (actionError) {
                          setError(actionError.message);
                        }
                      }}>
                        {reviewStatuses.map((status) => (
                          <option key={status} value={status}>{reviewStatusLabels[status]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {section === 'users' ? (
            <section className="appointment-list-card">
              <div className="admin-section-head">
                <div>
                  <span className="eyebrow">Cuentas</span>
                  <h3>Usuarios</h3>
                </div>
                <span className="soft-text">{users.length} registros</span>
              </div>
              <div className="appointment-stack">
                {users.map((user) => (
                  <div key={user.id} className="admin-row-card">
                    <div className="admin-row-copy">
                      <strong>{user.fullName}</strong>
                      <p>{user.email}</p>
                      <small>{user.role === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'} | {user.phone || 'Sin teléfono'} | {formatDate(user.createdAt)}</small>
                    </div>
                    <div className="appointment-buttons">
                      <button className="button secondary compact" onClick={async () => {
                        try {
                          setError('');
                          await deleteAdminUser(auth.token, user.id);
                          setInfo('Usuario eliminado.');
                          await refreshSection('users');
                        } catch (actionError) {
                          setError(actionError.message);
                        }
                      }} type="button">Borrar</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
