import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, User, IndianRupee, MapPin } from 'lucide-react';

const Page3 = () => {
  const { formData, updateFormData } = useForm();
  const navigate = useNavigate();

  const [loanType, setLoanType] = useState(formData.loanType || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!loanType) {
      setError('Please select a loan type');
      return;
    }
    // Basic validation for dynamic fields
    if (loanType === 'Salaried') {
      if (!formData.salary || !formData.loanAmount || !formData.designation) {
        setError('Please fill all mandatory fields');
        return;
      }
    } else if (loanType === 'Business') {
      if (!formData.loanAmount) {
        setError('Please enter loan amount required');
        return;
      }
    }

    updateFormData({ loanType, currentStep: 4 });
    navigate('/page4');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setError('');
  };

  return (
    <div className="page-card">
      <h1>Loan Application</h1>
      <p className="page-desc">Tell us a bit more about your employment and loan requirements.</p>

      <div className="form-group">
        <label>I am a</label>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            type="button"
            className={`btn-outline ${loanType === 'Salaried' ? 'active' : ''}`}
            onClick={() => setLoanType('Salaried')}
            style={{ 
              flex: 1, padding: '15px', border: '1.5px solid var(--border-color)', 
              borderRadius: '8px', background: loanType === 'Salaried' ? '#e3f2fd' : 'white',
              borderColor: loanType === 'Salaried' ? 'var(--primary)' : 'var(--border-color)',
              fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <User size={18} /> Salaried
          </button>
          <button 
            type="button"
            className={`btn-outline ${loanType === 'Business' ? 'active' : ''}`}
            onClick={() => setLoanType('Business')}
            style={{ 
              flex: 1, padding: '15px', border: '1.5px solid var(--border-color)', 
              borderRadius: '8px', background: loanType === 'Business' ? '#e3f2fd' : 'white',
              borderColor: loanType === 'Business' ? 'var(--primary)' : 'var(--border-color)',
              fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Briefcase size={18} /> Business
          </button>
        </div>
      </div>

      {loanType === 'Salaried' && (
        <div className="fade-in">
          <div className="form-group">
            <label>Current Annual Salary</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-sub)' }}>₹</span>
              <input 
                type="tel" 
                name="salary"
                className="input-field"
                style={{ paddingLeft: '30px' }}
                placeholder="e.g. 5,00,000"
                value={formData.salary}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Loan Amount Required</label>
            <input 
              type="tel" 
              name="loanAmount"
              className="input-field"
              placeholder="e.g. 1,00,000"
              value={formData.loanAmount}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Do you have PF?</label>
            <div className="radio-group">
              <label className="radio-item">
                <input type="radio" name="hasPF" value="Yes" checked={formData.hasPF === 'Yes'} onChange={handleInputChange} /> Yes
              </label>
              <label className="radio-item">
                <input type="radio" name="hasPF" value="No" checked={formData.hasPF === 'No'} onChange={handleInputChange} /> No
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input 
              type="text" 
              name="designation"
              className="input-field"
              placeholder="e.g. Software Engineer"
              value={formData.designation}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {loanType === 'Business' && (
        <div className="fade-in">
          <div className="form-group">
            <label>Do you have GST Number?</label>
            <div className="radio-group">
              <label className="radio-item">
                <input type="radio" name="hasGST" value="Yes" checked={formData.hasGST === 'Yes'} onChange={handleInputChange} /> Yes
              </label>
              <label className="radio-item">
                <input type="radio" name="hasGST" value="No" checked={formData.hasGST === 'No'} onChange={handleInputChange} /> No
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Business Registration Proof</label>
            <div className="radio-group">
              <label className="radio-item">
                <input type="radio" name="businessRegistration" value="Yes" checked={formData.businessRegistration === 'Yes'} onChange={handleInputChange} /> Yes
              </label>
              <label className="radio-item">
                <input type="radio" name="businessRegistration" value="No" checked={formData.businessRegistration === 'No'} onChange={handleInputChange} /> No
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Loan Amount Required</label>
            <input 
              type="tel" 
              name="loanAmount"
              className="input-field"
              placeholder="e.g. 5,00,000"
              value={formData.loanAmount}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

    <button 
  className="btn-primary" 
  style={{ marginTop: '20px' }}
  onClick={handleSubmit}
  disabled={loading}
>
  {loading ? 'Submitting...' : 'Submit'}
</button>

    </div>
  );
};

export default Page3;
