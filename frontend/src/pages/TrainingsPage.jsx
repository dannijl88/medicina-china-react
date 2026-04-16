import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

function formatPrice(priceCents, currency) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: (currency || 'EUR').toUpperCase()
  }).format(priceCents / 100);
}

export function TrainingsPage({ trainings }) {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Formaciones"
        title="Formaciones"
        description="Consulta cada formación, revisa su contenido y solicita el acceso por contacto directo."
      />

      <section className="section trainings-intro-grid">
        <article className="highlight-card">
          <h3>Qué incluyen</h3>
          <p>Material estructurado por bloques, contenidos descargables y una propuesta pensada para estudiar a tu ritmo.</p>
        </article>
        <article className="highlight-card">
          <h3>Cómo solicitar</h3>
          <p>Entras en la ficha, revisas el contenido y desde allí solicitas la formación para recibir instrucciones de pago por Bizum.</p>
        </article>
        <article className="highlight-card">
          <h3>Para quién son</h3>
          <p>Personas que quieren profundizar en tarot, energía y bienestar con un enfoque práctico, claro y accesible.</p>
        </article>
      </section>

      <div className="card-grid">
        {trainings.map((training) => (
          <article key={training.slug} className="product-card training-card">
            <img alt={training.title} className="card-image" src={training.imageUrl} />
            <div className="product-badge">{formatPrice(training.priceCents, training.currency)}</div>
            <h3>{training.title}</h3>
            <p>{training.summary}</p>
            <small>{training.modality} · {training.durationLabel}</small>
            <div className="training-card-footer">
              <Link className="button secondary cta-button" to={`/formaciones/${training.slug}`}>
                Ver formación
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
