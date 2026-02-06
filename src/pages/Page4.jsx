import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Page4 = () => {
  const { formData, resetForm } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Final submission to backend
    const submitData = async () => {
      try {
        await axios.post('http://localhost:5000/api/submit-loan', formData);
      } catch (e) {
        console.error('Final submission failed');
      }
    };
    submitData();
  }, []);

  const maskPhone = (num) => `+91 ******${num.slice(-4)}`;
  const maskPAN = (pan) => `${pan.slice(0, 2)}*****${pan.slice(-1)}`;

  return (
    <div className="page-card" style={{ textAlign: 'center' }}>
      <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '20px' }} />
      <h1>Success!</h1>
      <p className="page-desc" style={{ marginBottom: '40px' }}>
        Thank you for submitting your details.<br /> 
        Our team will contact you shortly.
      </p>

      <div style={{ textAlign: 'left', background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1rem' }}>Application Summary</h3>
        
        <div className="summary-row">
          <span className="summary-label">Mobile Number</span>
          <span className="summary-value">{maskPhone(formData.mobile)}</span>
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
          <span className="summary-value">{formData.loanType}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Required Amount</span>
          <span className="summary-value">₹ {formData.loanAmount}</span>
        </div>
      </div>

      <button 
        className="btn-primary" 
        style={{ background: '#64748b' }}
        onClick={() => {
          resetForm();
          navigate('/page1');
        }}
      >
        <ArrowLeft size={18} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
        Back to Home
      </button>
    </div>
  );
};

export default Page4;
