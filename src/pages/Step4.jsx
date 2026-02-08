import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import {
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  IndianRupee
} from 'lucide-react';

const Step4 = () => {
  const { formData, resetForm } = useForm();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // 🔥 Send data to Sheety ONCE
  useEffect(() => {
    if (submitted) return;

    const submitToSheety = async () => {
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
                loanType: formData.loanType,
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

        if (response.ok) {
          setSubmitted(true);
        } else {
          console.error('Sheety error', await response.text());
        }
      } catch (err) {
        console.error('Sheety submission failed', err);
      }
    };

    submitToSheety();
  }, [submitted, formData]);

  // Mask helpers
  const maskMobile = (mobile) =>
    mobile ? mobile.slice(0, 2) + '******' + mobile.slice(-2) : '';

  const maskPAN = (pan) =>
    pan ? pan.slice(0, 2) + '******' + pan.slice(-2) : '';

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
              <strong>{formData.pinCode}</strong>
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
              <strong style={{ textTransform: 'capitalize' }}>
                {formData.loanType}
              </strong>
            </div>
          </div>

          <div className="summary-item full-width">
            <IndianRupee size={16} />
            <div className="data">
              <span>Loan Required</span>
              <strong>
                ₹{Number(formData.loanAmount).toLocaleString('en-IN')}
              </strong>
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
console.log("FORM DATA SENT TO SHEETY:", formData);

export default Step4;
