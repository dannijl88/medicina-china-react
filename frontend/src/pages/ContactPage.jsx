import { useState } from 'react';
import { PageHero } from '../components/PageHero';

const contactEmail = 'medicina.tradicionalchinaa@gmail.com';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  function handleSubmit(event) {
    event.preventDefault();

    const subject = form.subject || 'Consulta desde la web';
    const body = [
      `Nombre: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      `Telefono: ${form.phone || '-'}`,
      '',
      form.message || ''
    ].join('\n');

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="section page-section">
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu proceso, tus dudas o tu próxima visita"
        description="Pide información, reserva, compra productos o solicita formaciones."
      />
      <section className="contact-grid">
        <article className="contact-card">
          <h3>Información de contacto</h3>
          <p>Atención personalizada para terapias, talleres, productos, reservas y solicitud de formaciones.</p>
          <div className="contact-list">
            <div>
              <strong>Email</strong>
              <span>{contactEmail}</span>
            </div>
            <div>
              <strong>Teléfono</strong>
              <span>+34 600 123 456</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>De 9:00 a 14:00 y de 16:00 a 20:00 Lunes a viernes</span>
            </div>
            <div>
              <strong>Dirección</strong>
              <span>Crevillente (Alicante)</span>
            </div>
          </div>
        </article>

        <article className="contact-card">
          <h3>Formulario de contacto</h3>
          <p className="soft-text">
            Rellena el formulario y se abrirá tu aplicación de correo con el mensaje preparado para enviarlo.
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Nombre
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Tu nombre"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="tu@email.com"
              />
            </label>
            <label>
              Teléfono
              <input
                type="text"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="+34 600 123 456"
              />
            </label>
            <label>
              Asunto
              <input
                type="text"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                placeholder="Reserva, producto, formación..."
              />
            </label>
            <label>
              Mensaje
              <textarea
                rows="6"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Cuéntanos cómo podemos ayudarte"
              />
            </label>
            <button className="button primary" type="submit">
              Enviar
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
