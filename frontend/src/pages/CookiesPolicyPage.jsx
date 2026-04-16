import { PageHero } from '../components/PageHero';

export function CookiesPolicyPage() {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Legal"
        title="Política de cookies"
        description="Información básica sobre el uso de cookies en esta web."
      />
      <section className="contact-card legal-card">
        <h3>Uso de cookies</h3>
        <p>
          Esta web no utiliza cookies publicitarias, de perfilado ni de analítica propia.
        </p>

        <h3>Cookies técnicas</h3>
        <p>
          El sitio puede utilizar únicamente los elementos técnicos mínimos necesarios para permitir la navegación y el funcionamiento básico de la página.
        </p>

        <h3>Servicios de terceros</h3>
        <p>
          Si en el futuro se integran herramientas externas, contenidos embebidos o servicios de análisis, esta política se actualizará para reflejarlo.
        </p>

        <h3>Configuración del navegador</h3>
        <p>
          Puedes limitar o bloquear el uso de cookies desde la configuración de tu navegador.
        </p>
      </section>
    </main>
  );
}
