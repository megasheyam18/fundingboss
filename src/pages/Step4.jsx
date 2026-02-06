import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { CheckCircle, ShieldCheck, ArrowRight, User, Phone, MapPin, CreditCard, Briefcase, IndianRupee } from 'lucide-react';

const Step4 = () => {
    const { formData, resetForm } = useForm();
    const navigate = useNavigate();

    // Mask function
    const maskMobile = (mobile) => {
        if (!mobile) return '';
        return mobile.slice(0, 2) + '******' + mobile.slice(-2);
    };

    const maskPAN = (pan) => {
        if (!pan) return '';
        return pan.slice(0, 2) + '******' + pan.slice(-2);
    };

    const handleNewApplication = () => {
        resetForm();
        navigate('/step1');
    };

    return (
        <div className="step-card success-page fade-in">
            <div className="success-icon-container">
                <CheckCircle className="success-pulse" size={80} color="#10b981" />
            </div>

            <div className="step-header centered">
                <h1>Application Submitted!</h1>
                <p>Thank you for submitting your details. Our team will contact you shortly.</p>
            </div>

            <div className="summary-card">
                <h3>Application Summary</h3>
                
                <div className="summary-grid">
                    <div className="summary-item">
                        <Phone size={16} />
                        <div className="data">
                            <span>Mobile Number</span>
                            <strong>{maskMobile(formData.mobile)}</strong>
                        </div>
                    </div>
                    
                    <div className="summary-item">
                        <MapPin size={16} />
                        <div className="data">
                            <span>PIN Code</span>
                            <strong>{formData.pincode}</strong>
                        </div>
                    </div>

                    <div className="summary-item">
                        <CreditCard size={16} />
                        <div className="data">
                            <span>PAN Number</span>
                            <strong>{maskPAN(formData.panNumber)}</strong>
                        </div>
                    </div>

                    <div className="summary-item">
                        <Briefcase size={16} />
                        <div className="data">
                            <span>Loan Type</span>
                            <strong style={{ textTransform: 'capitalize' }}>{formData.loanType}</strong>
                        </div>
                    </div>

                    <div className="summary-item full-width">
                        <IndianRupee size={16} />
                        <div className="data">
                            <span>Loan Required</span>
                            <strong>₹{Number(formData.loanAmount).toLocaleString('en-IN')}</strong>
                        </div>
                    </div>
                </div>

                <div className="verification-badge">
                    <ShieldCheck size={16} color="#10b981" />
                    <span>Identity Verified via PAN & CAPTCHA</span>
                </div>
            </div>

            <button className="submit-button secondary" onClick={handleNewApplication}>
                New Application <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default Step4;
