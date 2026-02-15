import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import {
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  IndianRupee
} from 'lucide-react';

const Step4 = () => {
  const { formData, resetForm } = useForm();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
    // Submission is handled in Step 3 via backend
    setSubmitted(true);
  }, []);

  // Mask helpers
  const maskMobile = (mobile) =>
    mobile ? mobile.slice(0, 2) + '******' + mobile.slice(-2) : '';

  const maskPAN = (pan) =>
    pan ? pan.slice(0, 2) + '******' + pan.slice(-2) : '';

  const handleNewApplication = () => {
    resetForm();
    navigate('/step1');
  };

  return (
    <div className="page-card" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <CheckCircle size={80} color="#10b981" />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h1>Application Submitted!</h1>
        <p className="page-desc">Thank you for submitting your details. Our team will contact you shortly.</p>
      </div>

      <div style={{ background: '#f8fbff', border: '1px solid #e3f2fd', borderRadius: '12px', padding: '20px', marginBottom: '30px', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)', fontSize: '1rem' }}>Application Summary</h3>

        <div>
          <div className="summary-row">
            <span className="summary-label">Mobile Number</span>
            <span className="summary-value">{maskMobile(formData.mobile)}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">PIN Code</span>
            <span className="summary-value">{formData.pinCode}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">PAN Number</span>
            <span className="summary-value">{maskPAN(formData.panNumber)}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Loan Type</span>
            <span className="summary-value" style={{ textTransform: 'capitalize' }}>{formData.loanType}</span>
          </div>

          <div className="summary-row" style={{ borderBottom: 'none' }}>
            <span className="summary-label">Loan Required</span>
            <span className="summary-value">₹{Number(formData.loanAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e3f2fd', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>Identity Verified via PAN & CAPTCHA</span>
        </div>
      </div>

      <button 
        className="btn-primary" 
        style={{ background: 'white', color: 'var(--primary)', border: '1.5px solid var(--primary)' }}
        onClick={handleNewApplication}
      >
        New Application <ArrowRight size={18} style={{ marginLeft: '8px' }} />
      </button>
    </div>
  );
};

export default Step4;
