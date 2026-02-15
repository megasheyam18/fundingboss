import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
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
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
