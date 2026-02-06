import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import { ShieldCheck, Phone, RefreshCcw } from 'lucide-react';

const Step1 = () => {
    const { formData, updateFormData, nextStep } = useForm();
    const navigate = useNavigate();
    
    const [mobile, setMobile] = useState(formData.mobile);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [captchaChallenge, setCaptchaChallenge] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(formData.captchaVerified);

    useEffect(() => {
        if (!captchaVerified) {
            fetchCaptcha();
        }
    }, []);

    const fetchCaptcha = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/generate-captcha');
            setCaptchaId(response.data.id);
            setCaptchaChallenge(response.data.challenge);
            setCaptchaInput('');
        } catch (err) {
            setError('Failed to load CAPTCHA. Please try again.');
        }
    };

    const handleMobileChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(val);
        setError('');
    };

    const verifyCaptcha = async () => {
        if (!captchaInput) return;
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/verify-captcha', {
                id: captchaId,
                userInput: captchaInput
            });
            if (response.data.success) {
                setCaptchaVerified(true);
                updateFormData({ captchaVerified: true });
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid CAPTCHA');
            fetchCaptcha();
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!captchaVerified) {
            setError('Please verify the CAPTCHA first');
            return;
        }
        updateFormData({ mobile, currentStep: 2 });
        navigate('/step2');
    };

    const isButtonEnabled = mobile.length === 10 && captchaVerified;

    return (
        <div className="step-card fade-in">
            <div className="step-header">
                <h2>Step 1 of 3</h2>
                <h1>Enter Mobile Number</h1>
                <p>Verify your identity to proceed with the application</p>
            </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <div className="input-with-icon">
                    <Phone size={18} className="icon" />
                    <input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={handleMobileChange}
                        autoComplete="tel"
                    />
                </div>
            </div>

            <div className="captcha-section">
                <label>Verification</label>
                {captchaVerified ? (
                    <div className="captcha-success">
                        <ShieldCheck color="#10b981" />
                        <span>CAPTCHA Verified</span>
                    </div>
                ) : (
                    <div className="captcha-container">
                        <div className="captcha-display">
                            <span className="captcha-text">{captchaChallenge}</span>
                            <button className="refresh-btn" onClick={fetchCaptcha} title="Refresh CAPTCHA">
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                        <div className="captcha-input-group">
                            <input
                                type="text"
                                placeholder="Enter characters"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                            />
                            <button 
                                className="verify-btn" 
                                onClick={verifyCaptcha}
                                disabled={!captchaInput || loading}
                            >
                                {loading ? 'Checking...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
                className="submit-button" 
                onClick={handleContinue}
                disabled={!isButtonEnabled}
            >
                Continue
            </button>
        </div>
    );
};

export default Step1;
