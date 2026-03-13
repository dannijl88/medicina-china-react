import { Link } from 'react-router-dom';
import { PreviewCard } from '../components/PreviewCard';
import homeSefaImage from '../assets/home-sefa.jpg';

export function HomePage({ home }) {
  return (
    <main>
      <section className="hero hero-home">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{home.hero.eyebrow}</span>
            <h1>{home.hero.title}</h1>
            <p>{home.hero.description}</p>
            <div className="hero-actions">
              <Link to="/terapias" className="button primary">{home.hero.primaryAction}</Link>
              <Link to="/productos" className="button secondary">{home.hero.secondaryAction}</Link>
              <Link to="/citas" className="button secondary">Gestionar citas</Link>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-title">Espacio de armonia</p>
            <ul>
              <li>Acupuntura personalizada</li>
              <li>Masajes relajantes y energeticos</li>
              <li>Tarot intuitivo y terapeutico</li>
              <li>Talleres vivenciales y productos artesanales</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="intro-feature-card">
          <img alt="Presentacion del espacio de bienestar" className="intro-portrait" src={homeSefaImage} />
          <div className="intro-band intro-band-copy">
            <span className="eyebrow">{home.home.aboutEyebrow}</span>
            <h2>{home.home.aboutTitle}</h2>
            {home.home.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section preview-grid">
        {home.home.supportCards.map((card) => (
          <PreviewCard
            key={card.title}
            title={card.title}
            description={card.description}
            action={card.action}
            to={card.to}
          />
        ))}
      </section>

      <section className="section split-highlight">
        <div className="section-heading">
          <span>Inicio</span>
          <h2>{home.home.supportTitle}</h2>
        </div>
        <div className="highlight-card">
          <p>
            La home ya refleja tambien el recorrido principal de tu web original: terapias, talleres y productos,
            manteniendo la estructura corporativa y enlazando con cada seccion.
          </p>
          <p>Desde aqui tambien se puede acceder a la gestion de citas y al area de usuario.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading testimonials-heading">
          <span>Testimonios</span>
          <h2>{home.home.testimonialsTitle}</h2>
        </div>
        <div className="preview-grid">
          {home.home.testimonials.map((testimonial) => (
            <article key={testimonial.name} className="preview-card testimonial-card">
              <p>{testimonial.text}</p>
              <strong>{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="family-card">
          <span className="eyebrow">Comunidad</span>
          <h2>{home.home.familyTitle}</h2>
          <a className="button primary" href={home.home.instagramUrl} rel="noreferrer" target="_blank">
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
