import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider, useForm } from './context/FormContext';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';

const ProtectedRoute = ({ children, step }) => {
  const { formData } = useForm();
  // Simple check: if trying to access step X, must have completed X-1 (tracked via currentStep)
  if (formData.currentStep < step) {
    return <Navigate to={`/page${formData.currentStep}`} replace />;
  }
  return children;
};

function App() {
  return (
    <FormProvider>
      <Router>
        <div className="app-container">
          <header className="header">
            <div className="logo">Funding<span>Boss</span></div>
          </header>
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/page1" replace />} />
              <Route path="/page1" element={<Page1 />} />
              <Route 
                path="/page2" 
                element={
                  <ProtectedRoute step={2}>
                    <Page2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/page3" 
                element={
                  <ProtectedRoute step={3}>
                    <Page3 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/page4" 
                element={
                  <ProtectedRoute step={4}>
                    <Page4 />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)', fontSize: '0.8rem' }}>
            © 2026 Funding Boss Financing Ltd.
          </footer>
        </div>
      </Router>
    </FormProvider>
  );
}

export default App;
