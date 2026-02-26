 import React, { useState, useEffect, Suspense, lazy } from 'react';
 import { Analytics } from "@vercel/analytics/react";
 import { SpeedInsights } from "@vercel/speed-insights/react";
 import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute.tsx';
 
 const Home = lazy(() => import('./pages/Home'));
 const AboutPage = lazy(() => import('./pages/AboutPage'));
 const Services = lazy(() => import('./pages/Services'));
 const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
 const AiAutomationPricing = lazy(() => import('./pages/AiAutomationPricing'));
 const AppDevelopmentPricing = lazy(() => import('./pages/AppDevelopmentPricing'));
 const CloudSolutionsPricing = lazy(() => import('./pages/CloudSolutionsPricing'));
 const DataAnalysisPricing = lazy(() => import('./pages/DataAnalysisPricing'));
 const WebDevPricing = lazy(() => import('./pages/WebDevPricing'));
 const Portfolio = lazy(() => import('./pages/Portfolio'));
 const Blog = lazy(() => import('./pages/Blog'));
 const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
 const Contact = lazy(() => import('./pages/Contact'));
 const Login = lazy(() => import('./pages/Login'));
 const Logout = lazy(() => import('./pages/Logout'));
 const Admin = lazy(() => import('./pages/Admin'));
 const AdminAbout = lazy(() => import('./pages/AdminAbout'));
 const AdminServices = lazy(() => import('./pages/AdminServices'));
 const AdminPricing = lazy(() => import('./pages/AdminPricing'));
 const AdminPortfolio = lazy(() => import('./pages/AdminPortfolio'));
 const AdminBlog = lazy(() => import('./pages/AdminBlog'));

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const GenericPage = ({ title }: { title: string }) => (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Content for {title} page would go here. This is a placeholder for the routing structure.</p>
    </div>
);

const AppRoutes: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/admin') || location.pathname.startsWith('/logout');
  useEffect(() => {
    const t = performance.now();
    const last = sessionStorage.getItem('nav:lastStart');
    if (last) {
      const dt = t - Number(last);
      sessionStorage.setItem('nav:lastDuration', String(Math.round(dt)));
    }
    sessionStorage.setItem('nav:lastStart', String(t));
  }, [location.pathname]);

  return (
    <>
      {!hideChrome && (
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
        />
      )}
      
       <Suspense
         fallback={
           <div className="min-h-screen pt-32 pb-12 px-4 max-w-7xl mx-auto">
             <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse"></div>
             <div className="space-y-2">
               <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
               <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
               <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
             </div>
           </div>
         }
       >
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/services" element={<Services />} />
           <Route path="/services/:id" element={<ServiceDetail />} />
           <Route path="/pricing/ai" element={<AiAutomationPricing />} />
           <Route path="/app-development" element={<AppDevelopmentPricing />} />
           <Route path="/data-analysis" element={<DataAnalysisPricing />} />
           <Route path="/web-development" element={<WebDevPricing />} />
           <Route path="/cloud-solutions" element={<CloudSolutionsPricing />} />
           <Route path="/about" element={<AboutPage />} />
           <Route path="/portfolio" element={<Portfolio />} />
           <Route path="/blog" element={<Blog />} />
           <Route path="/blog/:slug" element={<BlogPostPage />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/login" element={<Login />} />
           <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
           <Route path="/admin/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
           <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
           <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
           <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
           <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
           <Route path="/logout" element={<Logout />} />
         </Routes>
       </Suspense>

      {!hideChrome && <Footer />}
    </>
  );
};

 const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
 
  useEffect(() => {
    const onError = () => setHasError(true);
    const onRejection = () => setHasError(true);
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <ScrollToTop />
      <div className="animated-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
        <div className="noise-overlay"></div>
      </div>
      <div className="min-h-screen text-gray-900 dark:text-white font-sans transition-colors duration-300 relative">
         {hasError && (
           <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-sm px-4 py-2">
             An error occurred. Please reload the page.
           </div>
         )}
         <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
         <Analytics />
         <SpeedInsights />
      </div>
    </Router>
  );
};

export default App;
