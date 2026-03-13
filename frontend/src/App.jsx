import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCatalogItems, fetchProfile } from './api';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { TherapiesPage } from './pages/TherapiesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { TrainingsPage } from './pages/TrainingsPage';
import { TrainingDetailPage } from './pages/TrainingDetailPage';
import { TrainingCheckoutMockPage } from './pages/TrainingCheckoutMockPage';
import { TrainingCheckoutResultPage } from './pages/TrainingCheckoutResultPage';
import { AdminPage } from './pages/AdminPage';
import { siteContent } from './data/content';

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('mc_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [therapies, setTherapies] = useState(siteContent.therapies);
  const [workshops, setWorkshops] = useState(siteContent.workshops);
  const [products, setProducts] = useState(siteContent.products);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        const [therapyItems, workshopItems, productItems] = await Promise.all([
          fetchCatalogItems('THERAPY'),
          fetchCatalogItems('WORKSHOP'),
          fetchCatalogItems('PRODUCT')
        ]);

        if (!ignore) {
          setTherapies(therapyItems.map((item) => ({
            title: item.title,
            description: item.description,
            duration: item.metaPrimary || '',
            tag: item.metaSecondary || 'Terapias',
            image: item.imageUrl,
            slug: item.slug
          })));
          setWorkshops(workshopItems.map((item) => ({
            title: item.title,
            description: item.description,
            schedule: item.metaPrimary || '',
            image: item.imageUrl,
            slug: item.slug
          })));
          setProducts(productItems.map((item) => ({
            title: item.title,
            description: item.description,
            aroma: item.metaPrimary || '',
            format: item.metaSecondary || '',
            image: item.imageUrl,
            slug: item.slug
          })));
        }
      } catch {
        // Keep static fallback content if backend catalog is unavailable.
      }
    }

    loadCatalog();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      if (!auth?.token) {
        setProfile(null);
        return;
      }

      try {
        const data = await fetchProfile(auth.token);
        if (!ignore) {
          setProfile(data);
        }
      } catch {
        if (!ignore) {
          localStorage.removeItem('mc_auth');
          setAuth(null);
          setProfile(null);
        }
      }
    }

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [auth]);

  function logout() {
    localStorage.removeItem('mc_auth');
    setAuth(null);
    setProfile(null);
  }

  const isAdmin = (profile?.roles || auth?.roles || []).includes('ROLE_ADMIN');

  return (
    <BrowserRouter>
      <div className="page-shell">
        <SiteHeader isLoggedIn={Boolean(auth)} />
        <Routes>
          <Route path="/" element={<HomePage home={siteContent} />} />
          <Route
            path="/terapias"
            element={<TherapiesPage auth={auth} therapies={therapies} intro={siteContent.therapiesIntro} />}
          />
          <Route
            path="/talleres"
            element={<WorkshopsPage auth={auth} workshops={workshops} intro={siteContent.workshopsIntro} />}
          />
          <Route path="/formaciones" element={<TrainingsPage auth={auth} />} />
          <Route path="/formaciones/:slug" element={<TrainingDetailPage auth={auth} />} />
          <Route path="/formaciones/checkout-simulado" element={<TrainingCheckoutMockPage auth={auth} />} />
          <Route path="/formaciones/exito" element={<TrainingCheckoutResultPage success />} />
          <Route path="/formaciones/cancelada" element={<TrainingCheckoutResultPage success={false} />} />
          <Route
            path="/productos"
            element={<ProductsPage auth={auth} products={products} intro={siteContent.productsIntro} />}
          />
          <Route path="/contacto" element={<ContactPage />} />
          <Route
            path="/citas"
            element={<AppointmentsPage auth={auth} profile={profile} therapies={therapies} />}
          />
          <Route path="/admin" element={<AdminPage auth={auth} profile={profile} />} />
          <Route
            path="/login"
            element={
              <LoginPage
                auth={auth}
                profile={profile}
                setAuth={setAuth}
                logout={logout}
              />
            }
          />
        </Routes>
        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
