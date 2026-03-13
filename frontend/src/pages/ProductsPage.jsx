import { PageHero } from '../components/PageHero';

export function ProductsPage({ products, intro }) {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Productos"
        title="Velas y productos energeticos"
        description={intro}
      />
      <div className="card-grid">
        {products.map((product) => (
          <article key={product.title} className="product-card">
            <img alt={product.title} className="card-image" src={product.image} />
            <div className="product-badge">{product.format}</div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <small>{product.aroma}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
