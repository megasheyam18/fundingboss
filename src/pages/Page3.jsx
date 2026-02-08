import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { Briefcase, User } from 'lucide-react';

const Page3 = () => {
  const { formData, updateFormData } = useForm();
  const navigate = useNavigate();

  const [loanType, setLoanType] = useState(formData.loanType || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setError('');
  };

  const handleSubmit = async () => {
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

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://api.sheety.co/8158302f4f8bfc807bc480429465b087/Harish-project/sheet1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sheet1: {
              mobile: formData.mobile,
              pinCode: formData.pinCode,
              panNumber: formData.panNumber,
              loanType: loanType,
              salary: formData.salary,
              loanAmount: formData.loanAmount,
              hasPF: formData.hasPF,
              designation: formData.designation,
              hasGST: formData.hasGST,
              businessRegistration: formData.businessRegistration
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Sheety submission failed');
      }

      updateFormData({ loanType, currentStep: 4 });
      navigate('/page4');
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            className={`btn-outline ${loanType === 'Salaried' ? 'active' : ''}`}
            onClick={() => setLoanType('Salaried')}
          >
            <User size={18} /> Salaried
          </button>

          <button
            type="button"
            className={`btn-outline ${loanType === 'Business' ? 'active' : ''}`}
            onClick={() => setLoanType('Business')}
          >
            <Briefcase size={18} /> Business
          </button>
        </div>
      </div>

      {loanType === 'Salaried' && (
        <>
          <input
            name="salary"
            placeholder="Annual Salary"
            value={formData.salary}
            onChange={handleInputChange}
          />
          <input
            name="loanAmount"
            placeholder="Loan Amount"
            value={formData.loanAmount}
            onChange={handleInputChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleInputChange}
          />
        </>
      )}

      {loanType === 'Business' && (
        <>
          <input
            name="loanAmount"
            placeholder="Loan Amount"
            value={formData.loanAmount}
            onChange={handleInputChange}
          />
        </>
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
