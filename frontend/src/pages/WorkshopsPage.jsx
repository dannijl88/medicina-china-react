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

export function WorkshopsPage({ auth, workshops, intro }) {
  const reviewItems = workshops.map((workshop) => ({
    key: workshop.slug || slugify(workshop.title),
    label: workshop.title
  }));

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Talleres"
        title="Talleres grupales"
        description={intro}
      />
      <div className="stack-list">
        {workshops.map((workshop) => (
          <article key={workshop.title} className="stack-card stack-card-rich">
            <img alt={workshop.title} className="stack-image" src={workshop.image} />
            <div>
              <h3>{workshop.title}</h3>
              <p>{workshop.description}</p>
            </div>
            <span>{workshop.schedule}</span>
          </article>
        ))}
      </div>
      <ReviewsSection auth={auth} initialItemKey={reviewItems[0]?.key} items={reviewItems} reviewableType="WORKSHOP" title="Reseñas de talleres" />
    </main>
  );
}
