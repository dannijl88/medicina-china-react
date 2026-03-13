import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { ReviewsSection } from '../components/ReviewsSection';
import { fetchTrainings, fetchMyTrainingPurchases } from '../api';

function formatPrice(priceCents, currency) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: (currency || 'EUR').toUpperCase()
  }).format(priceCents / 100);
}

export function TrainingsPage({ auth }) {
  const [trainings, setTrainings] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const [trainingsData, purchasesData] = await Promise.all([
          fetchTrainings(auth?.token),
          auth?.token ? fetchMyTrainingPurchases(auth.token) : Promise.resolve([])
        ]);

        if (!ignore) {
          setTrainings(trainingsData);
          setPurchases(purchasesData);
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
  }, [auth]);

  const ownedTrainingIds = new Set(
    purchases.filter((purchase) => purchase.status === 'PAID').map((purchase) => purchase.trainingId)
  );

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Formaciones"
        title="Formaciones"
        description="Formaciones descargables con ficha individual, temario, compra y descarga protegida tras el pago."
      />

      {error ? <p className="error-text">{error}</p> : null}

      <section className="section trainings-intro-grid">
        <article className="highlight-card">
          <h3>Que incluyen</h3>
          <p>Material descargable, contenido estructurado por bloques y acceso desde tu cuenta una vez confirmada la compra.</p>
        </article>
        <article className="highlight-card">
          <h3>Como funciona</h3>
          <p>Entras en la ficha, revisas el contenido, compras con Stripe o en modo test y despues puedes descargar el material.</p>
        </article>
        <article className="highlight-card">
          <h3>Para quien son</h3>
          <p>Personas que quieren estudiar a su ritmo temas de tarot, energia y bienestar con una base practica y clara.</p>
        </article>
      </section>

      <div className="card-grid">
        {trainings.map((training) => (
          <article key={training.id} className="product-card training-card">
            <img alt={training.title} className="card-image" src={training.imageUrl} />
            <div className="product-badge">{formatPrice(training.priceCents, training.currency)}</div>
            <h3>{training.title}</h3>
            <p>{training.summary}</p>
            <small>{training.modality} · {training.durationLabel}</small>
            <div className="training-card-footer">
              {ownedTrainingIds.has(training.id) || training.accessGranted ? <span className="pill">Comprada</span> : null}
              <Link className="inline-link" to={`/formaciones/${training.slug}`}>Ver formacion</Link>
            </div>
          </article>
        ))}
      </div>

      <ReviewsSection
        auth={auth}
        initialItemKey={trainings[0]?.slug}
        items={trainings.map((training) => ({ key: training.slug, label: training.title }))}
        reviewableType="TRAINING"
        title="Reseñas de formaciones"
      />
    </main>
  );
}
