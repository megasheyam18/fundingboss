import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, IndianRupee, FileText } from 'lucide-react';
import API_URL from '../api/config';

const Step3 = () => {
    const { formData, updateFormData, syncLead } = useForm();
    const navigate = useNavigate();
    
    const [loanType, setLoanType] = useState(formData.loanType || '');
    const [salary, setSalary] = useState(formData.salary || '');
    const [loanAmount, setLoanAmount] = useState(formData.loanAmount || '');
    const [hasPF, setHasPF] = useState(formData.hasPF || '');
    const [designation, setDesignation] = useState(formData.designation || '');
    const [hasGST, setHasGST] = useState(formData.hasGST || '');
    const [businessRegistration, setBusinessRegistration] = useState(formData.businessRegistration || '');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoanTypeChange = (type) => {
        setLoanType(type);
        setError('');
    };

    // Auto-sync with Google Sheet on any field change
    useEffect(() => {
        const localData = {
            loanType,
            salary,
            loanAmount,
            hasPF,
            designation,
            hasGST,
            businessRegistration
        };
        syncLead({ ...formData, ...localData });
    }, [loanType, salary, loanAmount, hasPF, designation, hasGST, businessRegistration]);

    const handleSubmit = async () => {
        if (!loanType) {
            setError('Please select a loan type');
            return;
        }

        if (loanType === 'Salaried' && (!salary || !loanAmount || !designation || !hasPF)) {
            setError('Please fill all salaried details including PF status');
            return;
        }

        if (loanType === 'Business' && (!loanAmount || !hasGST || !businessRegistration)) {
            setError('Please fill all business details including GST and Registration status');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/submit-loan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    loanType,
                    salary,
                    loanAmount,
                    hasPF,
                    designation,
                    hasGST,
                    businessRegistration
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
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
                console.error('Submission Error:', data);
                setError(data.message || data.error || 'Submission failed. Please try again.');
            }
        } catch (err) {
            console.error('Network/Client Error:', err);
            setError('An error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        if (!loanType) return false;
        if (loanType === 'Salaried') return salary && loanAmount && designation && hasPF;
        if (loanType === 'Business') return loanAmount && hasGST && businessRegistration;
        return false;
    };

    return (
        <div className="page-card">
            <div>
                <button 
                    style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', marginBottom: '20px', padding: 0 }} 
                    onClick={() => navigate('/step2')} 
                    disabled={loading}
                >
                    ← Back
                </button>
                <h1>Professional Details</h1>
                <p className="page-desc">Provide your income information to get your offer</p>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button 
                    className="btn-primary"
                    style={{ 
                        flex: 1, 
                        background: loanType === 'Salaried' ? 'var(--primary)' : 'white',
                        color: loanType === 'Salaried' ? 'white' : 'var(--primary)',
                        border: '1.5px solid var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 15px',
                        height: 'auto',
                        minHeight: '100px'
                    }}
                    onClick={() => handleLoanTypeChange('Salaried')}
                    disabled={loading}
                >
                    <Briefcase size={24} />
                    <span style={{ fontSize: '0.9rem', marginTop: '10px', fontWeight: '500' }}>Salaried</span>
                </button>
                <button 
                    className="btn-primary"
                    style={{ 
                        flex: 1, 
                        background: loanType === 'Business' ? 'var(--primary)' : 'white',
                        color: loanType === 'Business' ? 'white' : 'var(--primary)',
                        border: '1.5px solid var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px 15px',
                        height: 'auto',
                        minHeight: '100px'
                    }}
                    onClick={() => handleLoanTypeChange('Business')}
                    disabled={loading}
                >
                    <IndianRupee size={24} />
                    <span style={{ fontSize: '0.9rem', marginTop: '10px', fontWeight: '500' }}>Business</span>
                </button>
            </div>

            {loanType === 'Salaried' && (
                <div>
                    <div className="form-group">
                        <label>Monthly Salary (INR)</label>
                        <input 
                            className="input-field"
                            type="number" 
                            placeholder="E.g. 50000" 
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <input 
                            className="input-field"
                            type="number" 
                            placeholder="E.g. 200000" 
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Do you have PF?</label>
                        <div className="radio-group" style={{ marginTop: '10px' }}>
                            <label className="radio-item">
                                <input type="radio" value="Yes" checked={hasPF === 'Yes'} onChange={() => setHasPF('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className="radio-item">
                                <input type="radio" value="No" checked={hasPF === 'No'} onChange={() => setHasPF('No')} disabled={loading} />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Designation</label>
                        <input 
                            className="input-field"
                            type="text" 
                            placeholder="Job Title" 
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            )}

            {loanType === 'Business' && (
                <div>
                    <div className="form-group">
                        <label>Do you have GST?</label>
                        <div className="radio-group" style={{ marginTop: '10px' }}>
                            <label className="radio-item">
                                <input type="radio" value="Yes" checked={hasGST === 'Yes'} onChange={() => setHasGST('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className="radio-item">
                                <input type="radio" value="No" checked={hasGST === 'No'} onChange={() => setHasGST('No')} disabled={loading} />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Business Registration Proof?</label>
                        <div className="radio-group" style={{ marginTop: '10px' }}>
                            <label className="radio-item">
                                <input type="radio" value="Yes" checked={businessRegistration === 'Yes'} onChange={() => setBusinessRegistration('Yes')} disabled={loading} />
                                <span>Yes</span>
                            </label>
                            <label className="radio-item">
                                <input type="radio" value="No" checked={businessRegistration === 'No'} onChange={() => setBusinessRegistration('No')} disabled={loading} />
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Loan Amount Required</label>
                        <input 
                            className="input-field"
                            type="number" 
                            placeholder="E.g. 500000" 
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
            )}

            {error && <div className="error-msg" style={{ marginBottom: '20px' }}>{error}</div>}

            <button 
                className="btn-primary" 
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
            >
                {loading ? 'Submitting...' : 'Submit Application'}
            </button>
        </div>
    );
};

export default Step3;
