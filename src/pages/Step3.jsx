import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, IndianRupee, FileText, CheckCircle2 } from 'lucide-react';

const Step3 = () => {
    const { formData, updateFormData } = useForm();
    const navigate = useNavigate();
    
    const [loanType, setLoanType] = useState(formData.loanType || '');
    const [salary, setSalary] = useState(formData.salary || '');
    const [loanAmount, setLoanAmount] = useState(formData.loanAmount || '');
    const [hasPF, setHasPF] = useState(formData.hasPF || '');
    const [designation, setDesignation] = useState(formData.designation || '');
    const [hasGST, setHasGST] = useState(formData.hasGST || '');
    const [businessRegProof, setBusinessRegProof] = useState(formData.businessRegProof || '');
    
    const [error, setError] = useState('');

    const handleLoanTypeChange = (type) => {
        setLoanType(type);
        setError('');
    };

    const handleSubmit = () => {
        if (!loanType) {
            setError('Please select a loan type');
            return;
        }

        if (loanType === 'salaried') {
            if (!salary || !loanAmount || !hasPF || !designation) {
                setError('Please fill all salaried details');
                return;
            }
        } else if (loanType === 'business') {
            if (!hasGST || !businessRegProof || !loanAmount) {
                setError('Please fill all business details');
                return;
            }
        }

        updateFormData({
            loanType,
            salary,
            loanAmount,
            hasPF,
            designation,
            hasGST,
            businessRegProof,
            currentStep: 4
        });
        navigate('/step4');
    };

    const isFormValid = () => {
        if (loanType === 'salaried') {
            return salary && loanAmount && hasPF && designation;
        }
        if (loanType === 'business') {
            return hasGST && businessRegProof && loanAmount;
        }
        return false;
    };

    return (
        <div className="step-card fade-in">
            <div className="step-header">
                <button className="back-link" onClick={() => navigate('/step2')}>← Back</button>
                <h2>Step 3 of 3</h2>
                <h1>Professional Details</h1>
                <p>Tell us about your source of income</p>
            </div>

            <div className="loan-type-toggle">
                <button 
                    className={`toggle-btn ${loanType === 'salaried' ? 'active' : ''}`}
                    onClick={() => handleLoanTypeChange('salaried')}
                >
                    <Briefcase size={20} />
                    <span>Salaried</span>
                </button>
                <button 
                    className={`toggle-btn ${loanType === 'business' ? 'active' : ''}`}
                    onClick={() => handleLoanTypeChange('business')}
                >
                    <IndianRupee size={20} />
                    <span>Business</span>
                </button>
            </div>

            {loanType === 'salaried' && (
                <div className="dynamic-fields fade-in">
                    <div className="form-group">
                        <label>Current Annual Salary</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="Annual CTC (e.g. 600000)" 
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="Amount (e.g. 100000)" 
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Do you have PF?</label>
                        <div className="radio-group">
                            <label className={`radio-label ${hasPF === 'yes' ? 'selected' : ''}`}>
                                <input type="radio" value="yes" checked={hasPF === 'yes'} onChange={() => setHasPF('yes')} />
                                Yes
                            </label>
                            <label className={`radio-label ${hasPF === 'no' ? 'selected' : ''}`}>
                                <input type="radio" value="no" checked={hasPF === 'no'} onChange={() => setHasPF('no')} />
                                No
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Designation</label>
                        <div className="input-with-icon">
                            <FileText size={16} className="icon" />
                            <input 
                                type="text" 
                                placeholder="Job Title" 
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {loanType === 'business' && (
                <div className="dynamic-fields fade-in">
                    <div className="form-group">
                        <label>Do you have GST Number?</label>
                        <div className="radio-group">
                            <label className={`radio-label ${hasGST === 'yes' ? 'selected' : ''}`}>
                                <input type="radio" value="yes" checked={hasGST === 'yes'} onChange={() => setHasGST('yes')} />
                                Yes
                            </label>
                            <label className={`radio-label ${hasGST === 'no' ? 'selected' : ''}`}>
                                <input type="radio" value="no" checked={hasGST === 'no'} onChange={() => setHasGST('no')} />
                                No
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Business Registration Proof?</label>
                        <div className="radio-group">
                            <label className={`radio-label ${businessRegProof === 'yes' ? 'selected' : ''}`}>
                                <input type="radio" value="yes" checked={businessRegProof === 'yes'} onChange={() => setBusinessRegProof('yes')} />
                                Yes
                            </label>
                            <label className={`radio-label ${businessRegProof === 'no' ? 'selected' : ''}`}>
                                <input type="radio" value="no" checked={businessRegProof === 'no'} onChange={() => setBusinessRegProof('no')} />
                                No
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="Amount (e.g. 500000)" 
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!isFormValid()}
            >
                Submit Application
            </button>
        </div>
    );
};

export default Step3;
