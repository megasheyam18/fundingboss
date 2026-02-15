import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import API_URL from '../api/config';
import { MapPin, CreditCard, User, CheckCircle, AlertTriangle } from 'lucide-react';

const Step2 = () => {
    const { formData, updateFormData } = useForm();
    const navigate = useNavigate();
    
    const [pinCode, setPinCode] = useState(formData.pinCode);
    const [panNumber, setPanNumber] = useState(formData.panNumber);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [panVerified, setPanVerified] = useState(formData.panVerified);

    const handlePinCodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        if (val.length === 1 && val !== '6') {
            alert("We are currently operating only in Tamil Nadu");
            return;
        }
        setPinCode(val);
        setError('');
    };

    const handlePanChange = (e) => {
        const val = e.target.value.toUpperCase().slice(0, 10);
        setPanNumber(val);
        setPanVerified(false);
        setError('');
    };

    const verifyPan = async () => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(panNumber)) {
            setError('Invalid PAN format (Example: ABCDE1234F)');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/verify-pan`, { panNumber });
            if (response.data.success) {
                setPanVerified(true);
                updateFormData({ panNumber, panVerified: true });
            }
        } catch (err) {
            setError('PAN verification failed. Please check the number.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (pinCode.length !== 6 || pinCode[0] !== '6') {
            setError('We only operate in Tamil Nadu (PIN must start with 6)');
            return;
        }
        if (!panVerified) {
            setError('Please verify your PAN details first');
            return;
        }
        updateFormData({ pinCode, currentStep: 3 });
        navigate('/step3');
    };

    const isButtonEnabled = pinCode.length === 6 && pinCode[0] === '6' && panVerified;

    return (
        <div className="page-card">
            <div>
                <button 
                    style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', marginBottom: '20px', padding: 0 }} 
                    onClick={() => navigate('/step1')}
                >
                    ← Back
                </button>
                <h1>Location & Identity</h1>
            </div>

            <div className="form-group">
                <label htmlFor="pinCode">PIN Code</label>
                <input
                    id="pinCode"
                    className="input-field"
                    type="text"
                    placeholder="6-digit PIN code"
                    value={pinCode}
                    onChange={handlePinCodeChange}
                />
                <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-sub)', fontSize: '0.75rem' }}>
                    Serviceable in Tamil Nadu only (PIN starts with 6)
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="panNumber">PAN Card Number</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        id="panNumber"
                        className="input-field"
                        style={{ flex: 1 }}
                        type="text"
                        placeholder="ABCDE1234F"
                        value={panNumber}
                        onChange={handlePanChange}
                        disabled={panVerified}
                    />
                    {!panVerified ? (
                        <button 
                            className="btn-primary" 
                            style={{ width: 'auto', padding: '0 20px' }}
                            onClick={verifyPan}
                            disabled={panNumber.length !== 10 || loading}
                        >
                            {loading ? '...' : 'Verify'}
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--success)' }}>
                             <CheckCircle size={18} />
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="error-msg">
                <AlertTriangle size={16} />
                <span>{error}</span>
            </div>}

            <button 
                className="btn-primary" 
                style={{ marginTop: '20px' }}
                onClick={handleNext}
                disabled={!isButtonEnabled}
            >
                Next
            </button>
        </div>
    );
};

export default Step2;
