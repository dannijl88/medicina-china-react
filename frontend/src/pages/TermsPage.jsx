import { PageHero } from '../components/PageHero';

export function TermsPage() {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Legal"
        title="Condiciones"
        description="Plantilla base para compras, solicitudes y contratacion de servicios o formaciones."
      />
      <section className="contact-card legal-card">
        <h3>Objeto</h3>
        <p>
          Estas condiciones regulan la solicitud y contratacion de terapias, talleres, productos y formaciones ofrecidos a traves de este sitio.
        </p>

        <h3>Reservas y solicitudes</h3>
        <p>
          Las reservas y solicitudes realizadas a traves del sitio quedan sujetas a confirmacion posterior por parte del negocio.
        </p>

        <h3>Pagos</h3>
        <p>
          Los pagos, cuando proceda, se realizaran por los medios indicados por el negocio, incluyendo Bizum u otros medios que se comuniquen al cliente.
        </p>

        <h3>Entregas y acceso</h3>
        <p>
          En el caso de productos o formaciones, la entrega o el acceso se realizara una vez confirmado el pago en los terminos acordados con el cliente.
        </p>

        <h3>Cancelaciones</h3>
        <p>
          Debes adaptar este apartado a la politica real de cancelaciones, devoluciones y cambios que quieras aplicar.
        </p>
      </section>
    </main>
  );
}
