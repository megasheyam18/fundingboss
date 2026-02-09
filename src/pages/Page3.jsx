import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, User } from 'lucide-react';

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

    if (loanType === 'Salaried') {
      if (!formData.salary || !formData.loanAmount || !formData.designation) {
        setError('Please fill all mandatory fields');
        return;
      }
    }

    if (loanType === 'Business') {
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
      <p className="page-desc">
        Tell us a bit more about your employment and loan requirements.
      </p>

      <div className="form-group">
        <label>I am a</label>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="button"
            onClick={() => setLoanType('Salaried')}
            className={`btn-outline ${loanType === 'Salaried' ? 'active' : ''}`}
          >
            <User size={18} /> Salaried
          </button>

          <button
            type="button"
            onClick={() => setLoanType('Business')}
            className={`btn-outline ${loanType === 'Business' ? 'active' : ''}`}
          >
            <Briefcase size={18} /> Business
          </button>
        </div>
      </div>

      {loanType === 'Salaried' && (
        <>
          <div className="form-group">
            <label>Current Annual Salary</label>
            <input
              type="tel"
              name="salary"
              className="input-field"
              value={formData.salary || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Loan Amount Required</label>
            <input
              type="tel"
              name="loanAmount"
              className="input-field"
              value={formData.loanAmount || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              className="input-field"
              value={formData.designation || ''}
              onChange={handleInputChange}
            />
          </div>
        </>
      )}

      {loanType === 'Business' && (
        <div className="form-group">
          <label>Loan Amount Required</label>
          <input
            type="tel"
            name="loanAmount"
            className="input-field"
            value={formData.loanAmount || ''}
            onChange={handleInputChange}
          />
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      <button
        className="btn-primary"
        style={{ marginTop: '20px' }}
        onClick={handleNext}
      >
        Continue
      </button>
    </div>
  );
};

export default Page3;
