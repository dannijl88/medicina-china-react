import { HashRouter, Route, Routes } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { TherapiesPage } from './pages/TherapiesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { TrainingsPage } from './pages/TrainingsPage';
import { TrainingDetailPage } from './pages/TrainingDetailPage';
import { LegalNoticePage } from './pages/LegalNoticePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiesPolicyPage } from './pages/CookiesPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { siteContent } from './data/content';

function App() {
  return (
    <HashRouter>
      <div className="page-shell">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage home={siteContent} />} />
          <Route
            path="/terapias"
            element={<TherapiesPage therapies={siteContent.therapies} intro={siteContent.therapiesIntro} />}
          />
          <Route
            path="/talleres"
            element={<WorkshopsPage workshops={siteContent.workshops} intro={siteContent.workshopsIntro} />}
          />
          <Route
            path="/formaciones"
            element={<TrainingsPage trainings={siteContent.trainings} />}
          />
          <Route
            path="/formaciones/:slug"
            element={<TrainingDetailPage trainings={siteContent.trainings} />}
          />
          <Route
            path="/productos"
            element={<ProductsPage products={siteContent.products} intro={siteContent.productsIntro} />}
          />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/aviso-legal" element={<LegalNoticePage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/condiciones" element={<TermsPage />} />
        </Routes>
        <SiteFooter />
      </div>
    </HashRouter>
  );
}

export default App;
