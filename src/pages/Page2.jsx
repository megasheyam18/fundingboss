import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import { ShieldCheck, Loader2, CheckCircle } from 'lucide-react';

const Page2 = () => {
  const { formData, updateFormData } = useForm();
  const navigate = useNavigate();

  const [pinCode, setPinCode] = useState(formData.pinCode);
  const [panNumber, setPanNumber] = useState(formData.panNumber);
  const [panStatus, setPanStatus] = useState(formData.panVerified ? 'verified' : 'idle');
  const [error, setError] = useState('');

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPinCode(val);
    if (val.length === 1 && val !== '6') {
      alert("We are currently operating only in Tamil Nadu");
      setPinCode('');
      return;
    }
    setError('');
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 10);
    setPanNumber(val);
    if (val.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)) {
      verifyPAN(val);
    } else {
      setPanStatus('idle');
    }
    setError('');
  };

  const verifyPAN = async (pan) => {
    setPanStatus('loading');
    try {
      const response = await axios.post('http://localhost:5000/api/verify-pan', { panNumber: pan });
      if (response.data.success) {
        setPanStatus('verified');
        updateFormData({ panVerified: true });
        // In a real app, we'd compare the fetched name with user input
        // For this flow, we'll auto-fill or allow user to enter and then compare
      }
    } catch (err) {
      setPanStatus('error');
      setError('PAN verification failed');
    }
  };

  const handleNext = () => {
    if (pinCode.length !== 6 || pinCode[0] !== '6') {
      setError('Invalid PIN Code for Tamil Nadu');
      return;
    }
    if (panStatus !== 'verified') {
      setError('Please verify your PAN card');
      return;
    }
    // Success logic: normally we'd compare fetched name here
    updateFormData({ pinCode, panNumber, currentStep: 3 });
    navigate('/page3');
  };

  return (
    <div className="page-card">
      <h1>Identity Details</h1>
      <p className="page-desc">Please provide your PIN code and PAN details for verification.</p>

      <div className="form-group">
        <label>PIN Code</label>
        <input 
          type="tel" 
          className="input-field"
          placeholder="6 digit PIN code (Must start with 6)"
          value={pinCode}
          onChange={handlePinChange}
          maxLength="6"
        />
      </div>

      <div className="form-group">
        <label>PAN Card Number</label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className={`input-field ${panStatus === 'verified' ? 'verified' : ''}`}
            placeholder="ABCDE1234F"
            value={panNumber}
            onChange={handlePanChange}
            maxLength="10"
          />
          <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
            {panStatus === 'loading' && <Loader2 className="spinner" size={20} />}
            {panStatus === 'verified' && <CheckCircle size={20} color="var(--success)" />}
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button 
        className="btn-primary" 
        style={{ marginTop: '20px' }}
        disabled={pinCode.length < 6 || panStatus !== 'verified'}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default Page2;
