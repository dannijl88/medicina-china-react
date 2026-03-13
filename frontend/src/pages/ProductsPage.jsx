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

export function ProductsPage({ auth, products, intro }) {
  const reviewItems = products.map((product) => ({
    key: product.slug || slugify(product.title),
    label: product.title
  }));

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
      <ReviewsSection auth={auth} initialItemKey={reviewItems[0]?.key} items={reviewItems} reviewableType="PRODUCT" title="Reseñas de productos" />
    </main>
  );
}
