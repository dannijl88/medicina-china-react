import { Link, useParams } from 'react-router-dom';

function formatPrice(priceCents, currency) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: (currency || 'EUR').toUpperCase()
  }).format(priceCents / 100);
}

export function TrainingDetailPage({ trainings }) {
  const { slug } = useParams();
  const training = trainings.find((item) => item.slug === slug);

  if (!training) {
    return (
      <main className="section page-section">
        <div className="empty-state">No hemos encontrado esa formación.</div>
      </main>
    );
  }

  return (
    <main className="section page-section">
      <section className="training-detail-shell">
        <article className="training-detail-card">
          <img alt={training.title} className="training-detail-image" src={training.imageUrl} />
          <div className="training-detail-copy">
            <span className="eyebrow">Formación</span>
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

            <div className="contact-highlight-card">
              <h3>Solicitar formación</h3>
              <p>
                Para acceder a esta formación, solicita la información desde contacto. El pago se realiza por Bizum y,
                una vez confirmado, se envía el material al correo indicado.
              </p>
              <p><strong>Bizum:</strong> +34 600 123 456</p>
            </div>

            <div className="hero-actions">
              <Link className="button primary" to="/contacto">Solicitar</Link>
              <Link className="button secondary" to="/formaciones">Volver a formaciones</Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
