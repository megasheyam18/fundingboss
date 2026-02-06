import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const LoanForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('in'); // 'in' or 'out'
  const [formData, setFormData] = useState({
    phone: '',
    panNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    businessProof: '',
    businessType: '',
    pinCode: '',
    consent: false
  });

  const [panStatus, setPanStatus] = useState('idle');
  const [verifiedName, setVerifiedName] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);

  // Masking functions
  const maskPhone = (num) => {
    if (num.length < 10) return num;
    return `91****${num.slice(-4)}`;
  };

  const maskPAN = (pan) => {
    if (pan.length < 10) return pan;
    return `${pan[0]}*****${pan.slice(-2)}`;
  };

  const maskName = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length < 2) return name[0] + '***';
    return `${parts[0][0]}*** ${parts[1][0]}***`;
  };

  const handlePhoneInput = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: val }));
    if (val.length === 10) setPhoneValid(true);
    else setPhoneValid(false);
  };

  const handlePanInput = (e) => {
    const val = e.target.value.toUpperCase().slice(0, 10);
    setFormData(prev => ({ ...prev, panNumber: val }));
    if (val.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)) {
      verifyPAN(val);
    } else {
      setPanStatus('idle');
      setVerifiedName('');
    }
  };

  const verifyPAN = async (pan) => {
    setPanStatus('loading');
    try {
      const response = await axios.post('http://localhost:5000/api/verify-pan', { panNumber: pan });
      if (response.data.success) {
        setPanStatus('verified');
        setVerifiedName(response.data.data.fullName);
      } else {
        setPanStatus('error');
      }
    } catch (error) {
      setPanStatus('error');
    }
  };

  const nextStep = () => {
    setDirection('out');
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setDirection('in');
    }, 400);
  };

  const isStep1Complete = phoneValid && panStatus === 'verified' && formData.consent;

  return (
    <div className="app-container">
      {/* Progress Stepper */}
      <div className="progress-stepper">
        <div className="steps-row">
          <div className="step-line">
            <div 
              className="step-line-active" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
          
          {[1, 2, 3].map((step) => (
            <div 
              key={step} 
              className={`step-item ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step ? <CheckCircle2 size={24} /> : step}
              </div>
              <span className="step-label">
                {step === 1 ? 'Login Info' : step === 2 ? 'Basic Details' : 'Get Offer'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="main-content">
        {/* Left Side: Form Pane */}
        <div className={`form-pane ${direction === 'in' ? 'slide-in' : 'slide-out'}`}>
          {currentStep === 1 && (
            <div>
              <h2 className="pane-title">Please enter your Mobile and PAN number</h2>
              
              <div className="form-group">
                <label>Mobile Number</label>
                <div className="input-container">
                  <input 
                    type="tel" 
                    className={`input-field ${phoneValid ? 'verified' : ''}`}
                    placeholder="10-digit mobile number"
                    value={phoneValid ? maskPhone(formData.phone) : formData.phone}
                    onChange={handlePhoneInput}
                    disabled={phoneValid}
                  />
                  {phoneValid && <CheckCircle2 className="text-success" size={24} color="#43a047" />}
                </div>
              </div>

              <div className="form-group">
                <label>PAN Number</label>
                <div className="input-container">
                  <input 
                    type="text" 
                    className={`input-field ${panStatus === 'verified' ? 'verified' : ''}`}
                    placeholder="AAAAA1111A"
                    value={panStatus === 'verified' ? maskPAN(formData.panNumber) : formData.panNumber}
                    onChange={handlePanInput}
                    disabled={panStatus === 'verified'}
                  />
                  {panStatus === 'loading' && <Loader2 className="spinner" size={20} />}
                  {panStatus === 'verified' && <CheckCircle2 size={24} color="#43a047" />}
                </div>
                {panStatus === 'verified' && (
                  <div className="status-msg-success">
                    <ShieldCheck size={16} />
                    PAN Verification successful
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="consent" 
                  checked={formData.consent}
                  onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                />
                <label htmlFor="consent" style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                  I have read and I agree to the <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Terms and Conditions</span>
                </label>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '20px', padding: '18px', fontSize: '1.1rem' }}
                disabled={!isStep1Complete}
                onClick={nextStep}
              >
                Proceed <ArrowRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="pane-title">Tell us about your business</h2>
              <p style={{ color: 'var(--text-sub)', marginBottom: '30px' }}>This helps us find the best loan offer for you.</p>
              
              <div className="form-group">
                <label>Business Registration Proof</label>
                <select className="input-field" required>
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type of Business</label>
                <select className="input-field" required>
                  <option value="">Select Type</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Pvt Ltd">Pvt Ltd</option>
                </select>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '20px', padding: '18px' }}
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <CheckCircle2 color="#43a047" size={80} style={{ marginBottom: '20px' }} />
              <h2 className="pane-title">Checking for offers...</h2>
              <p className="subheading">Please wait while we fetch the best rates for your profile.</p>
            </div>
          )}
        </div>

        {/* Right Side: Info Pane */}
        <div className="info-pane">
          <h3 className="info-title">Kindly keep the following ready:</h3>
          <ul className="info-list">
            <li>Your original PAN Card and Aadhaar number with its linked mobile number</li>
            <li>Blank white paper and pen</li>
            <li>Your existing / other bank account Debit Card / NetBanking / UPI details</li>
          </ul>
          <div className="info-footer">
            Note: We are available to serve you between 8 am to 9 pm.
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanForm;
