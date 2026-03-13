import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProfile } from './api';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { TherapiesPage } from './pages/TherapiesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { siteContent } from './data/content';

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('mc_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);

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

  return (
    <BrowserRouter>
      <div className="page-shell">
        <SiteHeader isLoggedIn={Boolean(auth)} />
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
            path="/productos"
            element={<ProductsPage products={siteContent.products} intro={siteContent.productsIntro} />}
          />
          <Route path="/contacto" element={<ContactPage />} />
          <Route
            path="/citas"
            element={<AppointmentsPage auth={auth} profile={profile} therapies={siteContent.therapies} />}
          />
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
