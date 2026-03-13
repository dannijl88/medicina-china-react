import { useEffect, useState } from 'react';
import { fetchPendingReviews, updateReviewStatus } from '../api';

export function AdminReviewsPanel({ auth, visible }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!visible || !auth?.token) {
        return;
      }

      try {
        const data = await fetchPendingReviews(auth.token);
        if (!ignore) {
          setReviews(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [auth, visible]);

  async function handleStatus(reviewId, status) {
    if (!auth?.token) {
      return;
    }

    try {
      await updateReviewStatus(auth.token, reviewId, status);
      const data = await fetchPendingReviews(auth.token);
      setReviews(data);
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <section className="admin-appointments">
      <div className="section-heading">
        <span>Administración</span>
        <h2>Moderación de reseñas</h2>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="appointment-stack">
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review.id} className="appointment-item admin-item">
              <div>
                <strong>{review.itemLabel}</strong>
                <p>{review.reviewableType} · {review.authorName}</p>
                <small>{review.title} | {review.comment}</small>
              </div>
              <div className="appointment-buttons">
                <button className="button primary compact" onClick={() => handleStatus(review.id, 'APPROVED')} type="button">
                  Aprobar
                </button>
                <button className="button secondary compact" onClick={() => handleStatus(review.id, 'REJECTED')} type="button">
                  Rechazar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-inline">No hay reseñas pendientes.</div>
        )}
      </div>
    </section>
  );
}
