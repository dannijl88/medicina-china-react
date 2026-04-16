import { PageHero } from '../components/PageHero';

export function PrivacyPolicyPage() {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Legal"
        title="Politica de privacidad"
        description="Plantilla base para que sustituyas los datos del negocio y herramientas reales."
      />
      <section className="contact-card legal-card">
        <h3>Responsable del tratamiento</h3>
        <p><strong>Responsable:</strong> Daniel Juan Lician</p>
        <p><strong>Email:</strong> dannijl88web@gmail.com</p>

        <h3>Datos que se recogen</h3>
        <p>
          Se pueden recoger datos identificativos y de contacto a traves de formularios de contacto o solicitudes de informacion.
        </p>

        <h3>Finalidad</h3>
        <p>
          Gestionar consultas, atender solicitudes y mantener la relacion con potenciales clientes o personas interesadas.
        </p>

        <h3>Base juridica</h3>
        <p>
          Consentimiento del interesado, ejecucion de medidas precontractuales o contractuales, y cumplimiento de obligaciones legales.
        </p>

        <h3>Conservacion</h3>
        <p>
          Los datos se conservaran el tiempo necesario para cumplir la finalidad para la que fueron recabados o mientras exista obligacion legal.
        </p>

        <h3>Derechos</h3>
        <p>
          Puedes ejercer tus derechos de acceso, rectificacion, supresion, oposicion, limitacion y portabilidad escribiendo a dannijl88web@gmail.com.
        </p>
      </section>
    </main>
  );
}
