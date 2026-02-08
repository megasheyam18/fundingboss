import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    pinCode: '',
    panNumber: '',
    loanType: '', // 'Salaried' or 'Business'
    salary: '',
    loanAmount: '',
    hasPF: 'No',
    designation: '',
    hasGST: 'No',
    businessRegistration: 'No',
    currentStep: 1,
    captchaVerified: false,
    panVerified: false
  });

  // Restore from draft
  useEffect(() => {
    const saved = localStorage.getItem('fundboss_multi_page_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse draft');
      }
    }
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem('fundboss_multi_page_draft', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const resetForm = () => {
    setFormData({
      mobile: '',
      pinCode: '',
      panNumber: '',
      loanType: '',
      salary: '',
      loanAmount: '',
      hasPF: '',
      designation: '',
      hasGST: '',
      businessRegistration: '',
      currentStep: 1,
      captchaVerified: false,
      panVerified: false
    });
    localStorage.removeItem('fundboss_multi_page_draft');
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
