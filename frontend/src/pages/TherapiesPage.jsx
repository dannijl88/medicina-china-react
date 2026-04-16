import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isTarotTherapy(therapy) {
  const text = `${therapy.tag || ''} ${therapy.title || ''}`.toLowerCase();
  return (
    text.includes('tarot') ||
    text.includes('lectura') ||
    text.includes('diosas') ||
    text.includes('rueda de la vida') ||
    text.includes('atrae lo que deseas')
  );
}

function TherapyCard({ therapy }) {
  return (
    <article className="content-card">
      <img alt={therapy.title} className="card-image" src={therapy.image} />
      <span className="pill">{therapy.tag}</span>
      <h3>{therapy.title}</h3>
      <p>{therapy.description}</p>
      <strong>{therapy.duration}</strong>
      <Link className="button secondary cta-button" to="/contacto">
        Reservar
      </Link>
    </article>
  );
}

export function TherapiesPage({ therapies, intro }) {
  const standardTherapies = therapies.filter((therapy) => !isTarotTherapy(therapy));
  const tarotTherapies = therapies.filter(isTarotTherapy);

  return (
    <main className="section page-section">
      <PageHero eyebrow="Terapias" title="Terapias" description={intro} />

      <section className="content-group">
        <div className="section-heading">
          <span className="section-kicker">Bienestar</span>
          <h2>Terapias y sesiones</h2>
          <p className="soft-text">
            Acupuntura, masajes, equilibrio energético, velas canalizadas y otros
            acompañamientos orientados al bienestar físico, mental y emocional.
          </p>
        </div>
        <div className="card-grid">
          {standardTherapies.map((therapy) => (
            <TherapyCard key={therapy.title} therapy={therapy} />
          ))}
        </div>
      </section>

      <section className="content-group">
        <div className="section-heading">
          <span className="section-kicker">Tarot</span>
          <h2>Tarot y lecturas</h2>
          <p className="soft-text">
            Espacio dedicado a lecturas y sesiones canalizadas para claridad,
            autoconocimiento y acompañamiento en procesos personales.
          </p>
        </div>
        <div className="card-grid">
          {tarotTherapies.map((therapy) => (
            <TherapyCard key={therapy.title} therapy={therapy} />
          ))}
        </div>
      </section>
    </main>
  );
}
