import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import { MapPin, CreditCard, User, CheckCircle, AlertTriangle } from 'lucide-react';

const Step2 = () => {
    const { formData, updateFormData } = useForm();
    const navigate = useNavigate();
    
    const [pincode, setPincode] = useState(formData.pincode);
    const [panNumber, setPanNumber] = useState(formData.panNumber);
    const [panName, setPanName] = useState(formData.panName);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [panVerified, setPanVerified] = useState(formData.panVerified);

    const handlePincodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        if (val.length === 1 && val !== '6') {
            alert("We are currently operating only in Tamil Nadu");
            return;
        }
        setPincode(val);
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
        if (!panName.trim()) {
            setError('Please enter your name as per PAN');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/verify-pan', { panNumber });
            if (response.data.success) {
                const fetchedName = response.data.data.fullName.toUpperCase();
                const inputName = panName.trim().toUpperCase();

                if (fetchedName === inputName || (fetchedName === 'UNKNOWN USER')) {
                    setPanVerified(true);
                    updateFormData({ panNumber, panName, panVerified: true });
                } else {
                    setError(`Name mismatch. PAN belongs to: ${fetchedName}`);
                }
            }
        } catch (err) {
            setError('PAN verification failed. Please check the number.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (pincode.length !== 6 || pincode[0] !== '6') {
            setError('We only operate in Tamil Nadu (PIN must start with 6)');
            return;
        }
        if (!panVerified) {
            setError('Please verify your PAN details first');
            return;
        }
        updateFormData({ pincode, currentStep: 3 });
        navigate('/step3');
    };

    const isButtonEnabled = pincode.length === 6 && pincode[0] === '6' && panVerified;

    return (
        <div className="step-card fade-in">
            <div className="step-header">
                <button className="back-link" onClick={() => navigate('/step1')}>← Back</button>
                <h2>Step 2 of 3</h2>
                <h1>Location & Identity</h1>
            </div>

            <div className="form-group">
                <label htmlFor="pincode">PIN Code</label>
                <div className="input-with-icon">
                    <MapPin size={18} className="icon" />
                    <input
                        id="pincode"
                        type="text"
                        placeholder="6-digit PIN code"
                        value={pincode}
                        onChange={handlePincodeChange}
                    />
                </div>
                <small>Serviceable in Tamil Nadu only (PIN starts with 6)</small>
            </div>

            <div className="form-group">
                <label htmlFor="panName">Name as per PAN</label>
                <div className="input-with-icon">
                    <User size={18} className="icon" />
                    <input
                        id="panName"
                        type="text"
                        placeholder="FULL NAME"
                        value={panName}
                        onChange={(e) => setPanName(e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ''))}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="panNumber">PAN Card Number</label>
                <div className="input-with-icon">
                    <CreditCard size={18} className="icon" />
                    <input
                        id="panNumber"
                        type="text"
                        placeholder="ABCDE1234F"
                        value={panNumber}
                        onChange={handlePanChange}
                        disabled={panVerified}
                    />
                    {!panVerified ? (
                        <button 
                            className="inline-verify-btn" 
                            onClick={verifyPan}
                            disabled={panNumber.length !== 10 || loading || !panName}
                        >
                            {loading ? '...' : 'Verify'}
                        </button>
                    ) : (
                        <CheckCircle size={18} className="status-icon success" />
                    )}
                </div>
            </div>

            {error && <div className="error-message alert-style">
                <AlertTriangle size={16} />
                <span>{error}</span>
            </div>}

            <button 
                className="submit-button" 
                onClick={handleNext}
                disabled={!isButtonEnabled}
            >
                Next
            </button>
        </div>
    );
};

export default Step2;
