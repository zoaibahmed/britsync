import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import ScrollToTop from './components/layout/ScrollToTop';
import CustomCursor from './components/ui/CustomCursor';
import GlobalBackground from './components/ui/GlobalBackground';
import BritSyncPreloader from './components/BritSyncPreloader';
import RobotAssistant from './components/ui/RobotAssistant';

import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProposalView from './pages/ProposalView';
import BritsyncDocuAdmin from './pages/BritsyncDocuAdmin';
import RecipientDocuSigning from './pages/RecipientDocuSigning';

import './index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate('/admin');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/britsync-docu" element={<BritsyncDocuAdmin />} />
        <Route path="/britsync-docu/:token" element={<RecipientDocuSigning />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/proposal/:id" element={<ProposalView />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/britsync-docu');
  const [isAppReady, setIsAppReady] = React.useState(false);

  React.useEffect(() => {
    // Single initialization of Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8, // Slightly softer for high-res feel
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <BritSyncPreloader onComplete={() => setIsAppReady(true)} />
      {isAppReady && (
        <React.Fragment>
          <GlobalBackground />
          <ScrollToTop />
          <CustomCursor />
          {!isAdminRoute && <Navbar />}
          <AnimatedRoutes />
          {!isAdminRoute && <Footer />}
          {/* {!isAdminRoute && <RobotAssistant />} */}
        </React.Fragment>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
