import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import { RefreshCcw, Loader2, CheckCircle } from 'lucide-react';

const Page1 = () => {
  const { formData, updateFormData } = useForm();
  const navigate = useNavigate();
  
  const [mobile, setMobile] = useState(formData.mobile || '');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState({ id: '', challenge: '', status: 'idle' });
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  // ✅ FIXED: use VITE_API_URL
  const fetchCaptcha = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/generate-captcha`
      );
      setCaptcha({
        id: response.data.id,
        challenge: response.data.challenge,
        status: 'idle'
      });
      setCaptchaInput('');
      setError('');
    } catch (err) {
      setError('Failed to load CAPTCHA');
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
    setError('');
  };

  // ✅ FIXED: use VITE_API_URL
  const verifyCaptcha = async () => {
    if (!captchaInput) return;
    setIsVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify-captcha`,
        {
          id: captcha.id,
          userInput: captchaInput
        }
      );

      if (response.data.success) {
        setCaptcha(prev => ({ ...prev, status: 'verified' }));
        updateFormData({ mobile, captchaVerified: true });
      }
    } catch (err) {
      setError('Invalid CAPTCHA code');
      fetchCaptcha();
      setCaptchaInput('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    if (mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }
    updateFormData({ mobile, currentStep: 2 });
    navigate('/page2');
  };

  const canContinue = mobile.length === 10 && captcha.status === 'verified';

  return (
    <div className="page-card">
      <h1>Let's get started</h1>
      <p className="page-desc">
        Enter your mobile number to begin your loan application.
      </p>

      <div className="form-group">
        <label>Mobile Number</label>
        <input
          type="tel"
          className={`input-field ${error && mobile.length !== 10 ? 'error' : ''}`}
          placeholder="Enter 10 digit mobile number"
          value={mobile}
          onChange={handleMobileChange}
          maxLength="10"
        />
      </div>

      <div className="form-group">
        <label>Verification</label>
        <div className="captcha-container">
          <div className="captcha-display">
            {captcha.challenge || '......'}
            <button
              type="button"
              onClick={fetchCaptcha}
              style={{ background: 'none', border: 'none', marginLeft: '10px', cursor: 'pointer' }}
            >
              <RefreshCcw size={18} color="#475569" />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter code"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              disabled={captcha.status === 'verified'}
            />

            {captcha.status !== 'verified' && (
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100px', padding: '10px' }}
                onClick={verifyCaptcha}
                disabled={!captchaInput || isVerifying}
              >
                {isVerifying ? <Loader2 className="spinner" size={18} /> : 'Verify'}
              </button>
            )}

            {captcha.status === 'verified' && (
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--success)' }}>
                <CheckCircle size={24} />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button
        className="btn-primary"
        style={{ marginTop: '20px' }}
        disabled={!canContinue}
        onClick={handleContinue}
      >
        Continue
      </button>

      <p style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-sub)', textAlign: 'center' }}>
        By continuing, you agree to our Terms & Conditions.
      </p>
    </div>
  );
};

export default Page1;
