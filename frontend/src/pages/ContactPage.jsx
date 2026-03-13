import { PageHero } from '../components/PageHero';

export function ContactPage() {
  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu proceso, tus dudas o tu proxima visita"
        description="Una pagina de contacto clara y corporativa para resolver consultas, pedir informacion o reservar una primera toma de contacto."
      />
      <section className="contact-grid">
        <article className="contact-card">
          <h3>Informacion de contacto</h3>
          <p>Atencion personalizada para terapias, talleres, productos y reservas online.</p>
          <div className="contact-list">
            <div>
              <strong>Email</strong>
              <span>hola@medicinachina.com</span>
            </div>
            <div>
              <strong>Telefono</strong>
              <span>+34 600 123 456</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>Lunes a viernes, 10:00 a 19:30</span>
            </div>
            <div>
              <strong>Direccion</strong>
              <span>Calle del Bienestar 18, Madrid</span>
            </div>
          </div>
        </article>

        <article className="contact-card">
          <h3>Escribenos</h3>
          <form className="contact-form">
            <label>
              Nombre
              <input type="text" placeholder="Tu nombre" />
            </label>
            <label>
              Email
              <input type="email" placeholder="tu@email.com" />
            </label>
            <label>
              Motivo
              <input type="text" placeholder="Terapias, talleres, productos..." />
            </label>
            <label>
              Mensaje
              <textarea rows="5" placeholder="Cuentanos como podemos ayudarte" />
            </label>
            <button className="button primary" type="button">Enviar consulta</button>
          </form>
        </article>
      </section>
    </main>
  );
}
