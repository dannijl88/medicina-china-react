import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { simulateTrainingPurchase } from '../api';

export function TrainingCheckoutMockPage({ auth }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const purchaseId = searchParams.get('purchase');

  async function handleSimulatePayment() {
    if (!auth?.token || !purchaseId) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await simulateTrainingPurchase(auth.token, purchaseId);
      navigate(`/formaciones/exito?purchase=${purchaseId}`);
    } catch (simulateError) {
      setError(simulateError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="section page-section">
      <div className="auth-card">
        <span className="eyebrow">Stripe test</span>
        <h2>Pago simulado</h2>
        <p className="soft-text">
          Esta pantalla solo se usa cuando no hay claves reales de Stripe configuradas. Sirve para probar el flujo
          completo de compra y descarga sin pasar por un cobro real.
        </p>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="hero-actions">
          <button className="button primary" disabled={!auth?.token || !purchaseId || submitting} onClick={handleSimulatePayment} type="button">
            Confirmar pago simulado
          </button>
          <Link className="button secondary" to="/formaciones">Cancelar</Link>
        </div>
      </div>
    </main>
  );
}
