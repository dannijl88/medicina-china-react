import { PageHero } from '../components/PageHero';
import { ReviewsSection } from '../components/ReviewsSection';

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function TherapiesPage({ auth, therapies, intro }) {
  const reviewItems = therapies.map((therapy) => ({
    key: therapy.slug || slugify(therapy.title),
    label: therapy.title
  }));

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Terapias"
        title="Terapias"
        description={intro}
      />
      <div className="card-grid">
        {therapies.map((therapy) => (
          <article key={therapy.title} className="content-card">
            <img alt={therapy.title} className="card-image" src={therapy.image} />
            <span className="pill">{therapy.tag}</span>
            <h3>{therapy.title}</h3>
            <p>{therapy.description}</p>
            <strong>{therapy.duration}</strong>
          </article>
        ))}
      </div>
      <ReviewsSection auth={auth} initialItemKey={reviewItems[0]?.key} items={reviewItems} reviewableType="THERAPY" title="Reseñas de terapias" />
    </main>
  );
}
