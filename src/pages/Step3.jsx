import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, IndianRupee, FileText } from 'lucide-react';

const Step3 = () => {
    const { formData, updateFormData } = useForm();
    const navigate = useNavigate();
    
    const [loanType, setLoanType] = useState(formData.loanType || 'Salaried');
    const [salary, setSalary] = useState(formData.salary || '');
    const [loanAmount, setLoanAmount] = useState(formData.loanAmount || '');
    const [hasPF, setHasPF] = useState(formData.hasPF || 'No');
    const [designation, setDesignation] = useState(formData.designation || '');
    const [hasGST, setHasGST] = useState(formData.hasGST || 'No');
    const [businessRegistration, setBusinessRegistration] = useState(formData.businessRegistration || 'No');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoanTypeChange = (type) => {
        setLoanType(type);
        setError('');
    };

    const handleSubmit = async () => {
        if (!loanType) {
            setError('Please select a loan type');
            return;
        }

        if (loanType === 'Salaried' && (!salary || !loanAmount || !designation)) {
            setError('Please fill all salaried details');
            return;
        }

        if (loanType === 'Business' && !loanAmount) {
            setError('Please fill all business details');
            return;
        }

        setLoading(true);
        setError('');

        const body = {
            "sheet1": {
                "mobile": formData.mobile,
                "pinCode": formData.pinCode,
                "panNumber": formData.panNumber,
                "loanType": loanType,
                "salary": salary,
                "loanAmount": loanAmount,
                "hasPF": hasPF,
                "designation": designation,
                "hasGST": hasGST,
                "businessRegistration": businessRegistration
            }
        };

        try {
            const response = await fetch('https://api.sheety.co/8158302f4f8bfc807bc480429465b087/Harish-project/sheet1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                updateFormData({
                    loanType,
                    salary,
                    loanAmount,
                    hasPF,
                    designation,
                    hasGST,
                    businessRegistration,
                    currentStep: 4
                });
                navigate('/step4');
            } else {
                setError('Submission failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        if (loanType === 'Salaried') return salary && loanAmount && designation;
        if (loanType === 'Business') return loanAmount;
        return false;
    };

    return (
        <div className="step-card fade-in">
            <div className="step-header">
                <button className="back-link" onClick={() => navigate('/step2')} disabled={loading}>← Back</button>
                <h2>Final Step</h2>
                <h1>Professional Details</h1>
                <p>Provide your income information to get your offer</p>
            </div>

            <div className="loan-type-toggle">
                <button 
                    className={`toggle-btn ${loanType === 'Salaried' ? 'active' : ''}`}
                    onClick={() => handleLoanTypeChange('Salaried')}
                    disabled={loading}
                >
                    <Briefcase size={20} />
                    <span>Salaried</span>
                </button>
                <button 
                    className={`toggle-btn ${loanType === 'Business' ? 'active' : ''}`}
                    onClick={() => handleLoanTypeChange('Business')}
                    disabled={loading}
                >
                    <IndianRupee size={20} />
                    <span>Business</span>
                </button>
            </div>

            {loanType === 'Salaried' && (
                <div className="dynamic-fields fade-in">
                    <div className="form-group">
                        <label>Monthly Salary (INR)</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="E.g. 50000" 
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="E.g. 200000" 
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Do you have PF?</label>
                        <div className="radio-group">
                            <label className={`radio-item ${hasPF === 'Yes' ? 'selected' : ''}`}>
                                <input type="radio" value="Yes" checked={hasPF === 'Yes'} onChange={() => setHasPF('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className={`radio-item ${hasPF === 'No' ? 'selected' : ''}`}>
                                <input type="radio" value="No" checked={hasPF === 'No'} onChange={() => setHasPF('No')} disabled={loading} />
                                <span>No</span>
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
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {loanType === 'Business' && (
                <div className="dynamic-fields fade-in">
                    <div className="form-group">
                        <label>Do you have GST?</label>
                        <div className="radio-group">
                            <label className={`radio-item ${hasGST === 'Yes' ? 'selected' : ''}`}>
                                <input type="radio" value="Yes" checked={hasGST === 'Yes'} onChange={() => setHasGST('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className={`radio-item ${hasGST === 'No' ? 'selected' : ''}`}>
                                <input type="radio" value="No" checked={hasGST === 'No'} onChange={() => setHasGST('No')} disabled={loading} />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Business Registration Proof?</label>
                        <div className="radio-group">
                            <label className={`radio-item ${businessRegistration === 'Yes' ? 'selected' : ''}`}>
                                <input type="radio" value="Yes" checked={businessRegistration === 'Yes'} onChange={() => setBusinessRegistration('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className={`radio-item ${businessRegistration === 'No' ? 'selected' : ''}`}>
                                <input type="radio" value="No" checked={businessRegistration === 'No'} onChange={() => setBusinessRegistration('No')} disabled={loading} />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <div className="input-with-icon">
                            <IndianRupee size={16} className="icon" />
                            <input 
                                type="number" 
                                placeholder="E.g. 500000" 
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button 
                className={`submit-button ${loading ? 'loading' : ''}`} 
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
            >
                {loading ? 'Submitting...' : 'Submit Application'}
            </button>
        </div>
    );
};

await fetch("http://localhost:5000/api/submit-loan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(formData)
});


export default Step3;
