import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

function classifyProduct(product) {
  const text = `${product.format || ''} ${product.title || ''}`.toLowerCase();
  if (text.includes('perfume')) {
    return 'perfumes';
  }
  if (text.includes('rolon')) {
    return 'rolones';
  }
  return 'velas';
}

function ProductCard({ product }) {
  return (
    <article className="product-card product-card-cta">
      <img alt={product.title} className="card-image" src={product.image} />
      <div className="product-badge">{product.format}</div>
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <small>{product.aroma}</small>
      <Link className="button secondary cta-button" to="/contacto">
        Comprar
      </Link>
    </article>
  );
}

export function ProductsPage({ products, intro }) {
  const candles = products.filter((product) => classifyProduct(product) === 'velas');
  const perfumes = products.filter((product) => classifyProduct(product) === 'perfumes');
  const rollOns = products.filter((product) => classifyProduct(product) === 'rolones');

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Productos"
        title="Velas y productos energéticos"
        description={intro}
      />

      <section className="content-group">
        <div className="section-heading">
          <span className="section-kicker">Velas</span>
          <h2>Velas ritualizadas y canalizadas</h2>
          <p className="soft-text">
            Colección de velas creadas para intención, equilibrio energético,
            rituales y acompañamiento de procesos personales.
          </p>
        </div>
        <div className="card-grid">
          {candles.map((product) => (
            <ProductCard key={product.slug || product.title} product={product} />
          ))}
        </div>
      </section>

      <section className="content-group">
        <div className="section-heading">
          <span className="section-kicker">Perfumes</span>
          <h2>Perfumes energéticos</h2>
          <p className="soft-text">
            Fragancias orientadas a limpieza, calma, abundancia y conexión con la
            intención que quieras trabajar.
          </p>
        </div>
        <div className="card-grid">
          {perfumes.map((product) => (
            <ProductCard key={product.slug || product.title} product={product} />
          ))}
        </div>
      </section>

      <section className="content-group">
        <div className="section-heading">
          <span className="section-kicker">Rolones</span>
          <h2>Rolones energéticos</h2>
          <p className="soft-text">
            Formato práctico para acompañarte en el día a día con calma, energía o
            empoderamiento personal.
          </p>
        </div>
        <div className="card-grid">
          {rollOns.map((product) => (
            <ProductCard key={product.slug || product.title} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
