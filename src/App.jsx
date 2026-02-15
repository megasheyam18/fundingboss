import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FormProvider, useForm } from './context/FormContext';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';

const ProtectedRoute = ({ children, step }) => {
  const { formData } = useForm();
  // Simple check: if trying to access step X, must have completed X-1 (tracked via currentStep)
  if (formData.currentStep < step) {
    return <Navigate to={`/step${formData.currentStep}`} replace />;
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
            <div className="badge-nbfc">NBFC Partnered</div>
          </header>
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/step1" replace />} />
              <Route path="/step1" element={<Step1 />} />
              <Route 
                path="/step2" 
                element={
                  <ProtectedRoute step={2}>
                    <Step2 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/step3" 
                element={
                  <ProtectedRoute step={3}>
                    <Step3 />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/step4" 
                element={
                  <ProtectedRoute step={4}>
                    <Step4 />
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
