import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PreviewCard } from '../components/PreviewCard';
import { fetchFeaturedReviews } from '../api';
import homeSefaImage from '../assets/home-sefa.jpg';

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function stars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function HomePage({ home }) {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedReviews() {
      try {
        const reviews = await fetchFeaturedReviews();
        if (!ignore && reviews.length) {
          setFeaturedReviews(shuffle(reviews));
        }
      } catch {
        if (!ignore) {
          setFeaturedReviews([]);
        }
      }
    }

    loadFeaturedReviews();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (featuredReviews.length <= 3) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRotationIndex((current) => (current + 3) % featuredReviews.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [featuredReviews]);

  const rotatingTestimonials = useMemo(() => {
    if (featuredReviews.length) {
      const visible = [];
      for (let index = 0; index < Math.min(3, featuredReviews.length); index += 1) {
        visible.push(featuredReviews[(rotationIndex + index) % featuredReviews.length]);
      }
      return visible.map((review) => ({
        name: review.authorName,
        text: `"${review.comment}"`,
        rating: review.rating
      }));
    }

    return home.home.testimonials;
  }, [featuredReviews, home.home.testimonials, rotationIndex]);

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
              {testimonial.rating ? <span className="pill review-stars">{stars(testimonial.rating)}</span> : null}
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
