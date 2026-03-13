import { Link, useLocation } from 'react-router-dom';

export function TrainingCheckoutResultPage({ success }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const purchaseId = params.get('purchase');
  const sessionId = params.get('session_id');

  return (
    <main className="section page-section">
      <div className="auth-card">
        <span className="eyebrow">Formaciones</span>
        <h2>{success ? 'Compra registrada' : 'Compra cancelada'}</h2>
        <p className="soft-text">
          {success
            ? 'Si el pago se ha completado, la descarga quedara disponible en la ficha de la formacion y en tus compras.'
            : 'La sesion de pago se ha cancelado. Puedes volver a intentarlo cuando quieras.'}
        </p>
        {purchaseId ? <p className="soft-text">Referencia de compra: {purchaseId}</p> : null}
        {sessionId ? <p className="soft-text">Sesion Stripe: {sessionId}</p> : null}
        <div className="hero-actions">
          <Link className="button primary" to="/formaciones">Ver formaciones</Link>
          <Link className="button secondary" to="/login">Mi espacio</Link>
        </div>
      </div>
    </main>
  );
}
