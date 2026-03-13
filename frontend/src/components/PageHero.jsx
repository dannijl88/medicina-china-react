export function PageHero({ eyebrow, title, description }) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
    </section>
  );
}
