import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PreviewCard } from '../components/PreviewCard';
import homeSefaImage from '../assets/home-sefa.jpg';

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function HomePage({ home }) {
  const [testimonials, setTestimonials] = useState(() => shuffle(home.home.testimonials));
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    setTestimonials(shuffle(home.home.testimonials));
  }, [home.home.testimonials]);

  useEffect(() => {
    if (testimonials.length <= 3) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRotationIndex((current) => (current + 3) % testimonials.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [testimonials]);

  const rotatingTestimonials = useMemo(() => {
    const visible = [];
    for (let index = 0; index < Math.min(3, testimonials.length); index += 1) {
      visible.push(testimonials[(rotationIndex + index) % testimonials.length]);
    }
    return visible;
  }, [rotationIndex, testimonials]);

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
              <Link to="/contacto" className="button secondary">Contactar</Link>
            </div>
          </div>

          <aside className="hero-card">
            <p className="card-title">Espacio de armonía</p>
            <ul>
              <li>Acupuntura personalizada</li>
              <li>Masajes relajantes y energéticos</li>
              <li>Tarot intuitivo y terapéutico</li>
              <li>Talleres vivenciales y productos artesanales</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="intro-feature-card">
          <img alt="Presentación del espacio de bienestar" className="intro-portrait" src={homeSefaImage} />
          <div className="intro-band intro-band-copy">
            <span className="eyebrow">{home.home.aboutEyebrow}</span>
            <h2>{home.home.aboutTitle}</h2>
            {home.home.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Inicio</span>
          <h2>{home.home.supportTitle}</h2>
        </div>
        <div className="preview-grid support-grid">
          {home.home.supportCards.map((card) => (
            <PreviewCard
              key={card.title}
              title={card.title}
              description={card.description}
              action={card.action}
              to={card.to}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading testimonials-heading">
          <span>Testimonios</span>
          <h2>{home.home.testimonialsTitle}</h2>
        </div>
        <div className="preview-grid">
          {rotatingTestimonials.map((testimonial, index) => (
            <article key={`${testimonial.name}-${index}`} className="preview-card testimonial-card rotating-testimonial-card">
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
