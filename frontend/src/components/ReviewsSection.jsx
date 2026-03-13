import { useEffect, useMemo, useState } from 'react';
import { createReview, fetchReviews } from '../api';

function formatDate(value) {
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function stars(rating) {
  return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
}

export function ReviewsSection({ auth, title, reviewableType, items, initialItemKey }) {
  const [selectedKey, setSelectedKey] = useState(initialItemKey || items[0]?.key || '');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const selectedItem = useMemo(
    () => items.find((item) => item.key === selectedKey) || items[0],
    [items, selectedKey]
  );

  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      if (!selectedItem?.key) {
        setReviews([]);
        return;
      }

      try {
        setError('');
        const data = await fetchReviews(reviewableType, selectedItem.key);
        if (!ignore) {
          setReviews(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      }
    }

    loadReviews();
    return () => {
      ignore = true;
    };
  }, [reviewableType, selectedItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!auth?.token || !selectedItem) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createReview(auth.token, {
        reviewableType,
        itemKey: selectedItem.key,
        itemLabel: selectedItem.label,
        rating: Number(form.rating),
        title: form.title,
        comment: form.comment
      });
      setForm({
        rating: 5,
        title: '',
        comment: ''
      });
      setSuccess('Reseña enviada. Queda pendiente de moderación.');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="section">
      <div className="section-heading testimonials-heading">
        <span>Reseñas</span>
        <h2>{title}</h2>
      </div>

      <div className="reviews-layout">
        <article className="appointment-form-card">
          <h3>Valorar contenido</h3>
          <label className="status-editor">
            Elemento
            <select value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)}>
              {items.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </label>

          {average ? <p className="soft-text">Media: {average}/5 · {reviews.length} reseñas publicadas</p> : null}

          {auth?.token ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Puntuación
                <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>{value} estrellas</option>
                  ))}
                </select>
              </label>
              <label>
                Título
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Resumen de tu experiencia"
                />
              </label>
              <label>
                Comentario
                <textarea
                  rows="5"
                  value={form.comment}
                  onChange={(event) => setForm({ ...form, comment: event.target.value })}
                  placeholder="Cuéntanos tu experiencia"
                />
              </label>
              {error ? <p className="error-text">{error}</p> : null}
              {success ? <p className="soft-text">{success}</p> : null}
              <button className="button primary" disabled={submitting} type="submit">
                {submitting ? 'Enviando...' : 'Enviar reseña'}
              </button>
            </form>
          ) : (
            <p className="soft-text">Inicia sesión para dejar una reseña. Las reseñas pasan por moderación antes de publicarse.</p>
          )}
        </article>

        <article className="appointment-list-card">
          <div className="list-header">
            <h3>Opiniones publicadas</h3>
            <span>{selectedItem?.label || ''}</span>
          </div>

          <div className="appointment-stack">
            {reviews.length ? (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-head">
                    <strong>{review.title}</strong>
                    <span className="pill review-stars">{stars(review.rating)}</span>
                  </div>
                  <p>{review.comment}</p>
                  <small>{review.authorName} · {formatDate(review.createdAt)}</small>
                </div>
              ))
            ) : (
              <div className="empty-inline">Todavía no hay reseñas publicadas para este elemento.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
