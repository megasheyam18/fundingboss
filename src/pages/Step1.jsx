import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import API_URL from '../api/config';
import { Phone, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

const Step1 = () => {
    const { formData, updateFormData, syncLead } = useForm();
    const navigate = useNavigate();
    
    const [mobile, setMobile] = useState(formData.mobile || '');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaData, setCaptchaData] = useState({ id: '', challenge: '' });
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');

    const fetchCaptcha = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/generate-captcha`);
            if (response.data.success) {
                setCaptchaData({
                    id: response.data.id,
                    challenge: response.data.challenge
                });
            }
        } catch (err) {
            setError('Failed to load CAPTCHA. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const handleMobileChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobile(val);
        setMobile(val); // Local state update
        setError('');
        
        // Sync to sheet (Debounced) - Pass the NEW value merged with current formData
        syncLead({ ...formData, mobile: val });
    };

    const handleCaptchaChange = (e) => {
        setCaptchaInput(e.target.value.toUpperCase().slice(0, 6));
        setError('');
    };

    const handleVerifyAndNext = async () => {
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (captchaInput.length !== 6) {
            setError('Please enter the 6-character CAPTCHA');
            return;
        }

        setVerifying(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/verify-captcha`, {
                id: captchaData.id,
                userInput: captchaInput
            });

            if (response.data.success) {
                updateFormData({ 
                    mobile, 
                    captchaVerified: true,
                    currentStep: 2 
                });
                navigate('/step2');
            }
        } catch (err) {
            setError('Invalid CAPTCHA. Please try again.');
            setCaptchaInput('');
            fetchCaptcha();
        } finally {
            setVerifying(false);
        }
    };

    const isButtonEnabled = mobile.length === 10 && captchaInput.length === 6 && !verifying;

    return (
        <div className="page-card">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              
                <h1 style={{ marginTop: '20px' }}>Get Started</h1>
                <p className="page-desc">Enter your mobile number to begin your application</p>
            </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }}>
                        <Phone size={18} />
                    </span>
                    <input
                        id="mobile"
                        className="input-field"
                        style={{ paddingLeft: '45px' }}
                        type="text"
                        placeholder="Enter 10-digit number"
                        value={mobile}
                        onChange={handleMobileChange}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Security Verification</label>
                <div className="captcha-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="captcha-display" style={{ flex: 1, marginBottom: 0 }}>
                            {loading ? '...' : captchaData.challenge}
                        </div>
                        <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                            onClick={fetchCaptcha}
                            type="button"
                            disabled={loading}
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
                <input
                    className="input-field"
                    style={{ marginTop: '15px' }}
                    type="text"
                    placeholder="Enter characters shown above"
                    value={captchaInput}
                    onChange={handleCaptchaChange}
                />
            </div>

            {error && (
                <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <button 
                className="btn-primary" 
                style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                onClick={handleVerifyAndNext}
                disabled={!isButtonEnabled}
            >
                {verifying ? 'Verifying...' : (
                    <>
                        Verify & Continue <ShieldCheck size={18} />
                    </>
                )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                By continuing, you agree to our Terms and Data Privacy Policy. No OTP will be sent.
            </p>
        </div>
    );
};

export default Step1;
