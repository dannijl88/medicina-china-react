import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

export function WorkshopsPage({ workshops, intro }) {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Talleres"
        title="Talleres grupales"
        description={intro}
      />
      <div className="stack-list">
        {workshops.map((workshop) => (
          <article key={workshop.slug || workshop.title} className="stack-card stack-card-rich">
            <img alt={workshop.title} className="stack-image" src={workshop.image} />
            <div>
              <h3>{workshop.title}</h3>
              <p>{workshop.description}</p>
              <Link className="button secondary cta-button" to="/contacto">
                Reservar
              </Link>
            </div>
            <span>{workshop.schedule}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
