import { PageHero } from '../components/PageHero';

export function LegalNoticePage() {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Legal"
        title="Aviso legal"
        description="Plantilla base para completar con los datos reales del negocio."
      />
      <section className="contact-card legal-card">
        <h3>Datos identificativos</h3>
        <p><strong>Titular:</strong> Daniel Juan Lician</p>
        <p><strong>NIF/CIF:</strong> 74364932k</p>
        <p><strong>Domicilio:</strong> Compositor Ruiz Gasch, 2</p>
        <p><strong>Email:</strong> dannijl88web@gmail.com</p>
        <p><strong>Telefono:</strong> 657 98 50 21</p>

        <h3>Objeto del sitio web</h3>
        <p>
          Este sitio web tiene por objeto informar sobre terapias, talleres, productos y formaciones, asi como facilitar el
          contacto con potenciales clientes.
        </p>

        <h3>Propiedad intelectual</h3>
        <p>
          Los textos, imagenes, logotipos y demas contenidos del sitio pertenecen a su titular o cuentan con autorizacion de uso.
        </p>

        <h3>Responsabilidad</h3>
        <p>
          El titular no se responsabiliza del mal uso de los contenidos ni de eventuales incidencias tecnicas ajenas a su control.
        </p>
      </section>
    </main>
  );
}
