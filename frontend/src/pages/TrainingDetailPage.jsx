import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createTrainingCheckout, downloadTraining, fetchMyTrainingPurchases, fetchTrainingBySlug } from '../api';
import { ReviewsSection } from '../components/ReviewsSection';

function formatPrice(priceCents, currency) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: (currency || 'EUR').toUpperCase()
  }).format(priceCents / 100);
}

export function TrainingDetailPage({ auth }) {
  const { slug } = useParams();
  const [training, setTraining] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const [trainingData, purchasesData] = await Promise.all([
          fetchTrainingBySlug(slug, auth?.token),
          auth?.token ? fetchMyTrainingPurchases(auth.token) : Promise.resolve([])
        ]);

        if (!ignore) {
          setTraining(trainingData);
          setPurchases(purchasesData);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [auth, slug]);

  async function handleCheckout() {
    if (!auth?.token || !training) {
      return;
    }

    setSubmitting(true);
    setError('');
    setInfo('');

    try {
      const session = await createTrainingCheckout(auth.token, training.id);
      if (session.alreadyPurchased) {
        setInfo('Ya tienes acceso a esta formación. Puedes descargarla debajo.');
        return;
      }

      window.location.href = session.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownload() {
    if (!auth?.token || !training) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const file = await downloadTraining(auth.token, training.id);
      const objectUrl = window.URL.createObjectURL(file.blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = file.fileName;
      link.click();
      window.URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="section page-section">
        <div className="empty-state">Cargando formación...</div>
      </main>
    );
  }

  if (error && !training) {
    return (
      <main className="section page-section">
        <div className="empty-state">{error}</div>
      </main>
    );
  }

  if (!training) {
    return null;
  }

  const owned = training.accessGranted || purchases.some(
    (purchase) => purchase.trainingId === training.id && purchase.status === 'PAID'
  );

  return (
    <main className="section page-section">
      <section className="training-detail-shell">
        <article className="training-detail-card">
          <img alt={training.title} className="training-detail-image" src={training.imageUrl} />
          <div className="training-detail-copy">
            <span className="eyebrow">Formación descargable</span>
            <h1 className="page-title">{training.title}</h1>
            <p className="page-description">{training.description}</p>

            <div className="training-meta-grid">
              <div className="training-meta-card">
                <strong>Precio</strong>
                <span>{formatPrice(training.priceCents, training.currency)}</span>
              </div>
              <div className="training-meta-card">
                <strong>Duración</strong>
                <span>{training.durationLabel}</span>
              </div>
              <div className="training-meta-card">
                <strong>Modalidad</strong>
                <span>{training.modality}</span>
              </div>
              <div className="training-meta-card">
                <strong>Nivel</strong>
                <span>{training.level}</span>
              </div>
            </div>

            {training.syllabus.length ? (
              <div className="training-syllabus">
                <h3>Contenido</h3>
                <ul>
                  {training.syllabus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? <p className="error-text">{error}</p> : null}
            {info ? <p className="soft-text">{info}</p> : null}

            <div className="hero-actions">
              {!auth?.token ? (
                <Link className="button primary" to="/login">Inicia sesión para comprar</Link>
              ) : owned ? (
                <button className="button primary" disabled={submitting} onClick={handleDownload} type="button">
                  Descargar formación
                </button>
              ) : (
                <button className="button primary" disabled={submitting} onClick={handleCheckout} type="button">
                  Comprar con Stripe
                </button>
              )}
              <Link className="button secondary" to="/formaciones">Volver a formaciones</Link>
            </div>
          </div>
        </article>
      </section>

      <ReviewsSection
        auth={auth}
        initialItemKey={training.slug}
        items={[{ key: training.slug, label: training.title }]}
        reviewableType="TRAINING"
        title="Reseñas de esta formación"
      />
    </main>
  );
}
