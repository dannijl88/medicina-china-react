import { PageHero } from '../components/PageHero';

export function TherapiesPage({ therapies, intro }) {
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
    </main>
  );
}
