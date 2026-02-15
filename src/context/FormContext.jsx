import React, { createContext, useContext, useState, useRef } from 'react';
import axios from 'axios';
import API_URL from '../api/config';

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
    panVerified: false,
    rowId: null,      // Store Google Sheet Row ID
    sheetName: null   // Store current Sheet Name
  });

  const debounceRef = useRef(null);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const syncLead = (currentData) => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout (500ms debounce)
    debounceRef.current = setTimeout(async () => {
      try {
        // CASE 1: Create New Lead (If no rowId yet)
        if (!currentData.rowId) {
          // Only create if we have a valid mobile number
          if (currentData.mobile && currentData.mobile.length === 10) {
            console.log("Syncing: Creating new lead...");
            const response = await axios.post(`${API_URL}/api/create-lead`, { 
              mobile: currentData.mobile 
            });

            if (response.data.success) {
              // Update state with new rowId and sheetName
              updateFormData({
                rowId: response.data.rowId,
                sheetName: response.data.sheet
              });
              console.log("Sync Success: Created Row", response.data.rowId);
            }
          }
        } 
        // CASE 2: Update Existing Lead
        else {
          console.log("Syncing: Updating lead...");
          const response = await axios.put(`${API_URL}/api/update-lead`, {
            rowId: currentData.rowId,
            currentSheet: currentData.sheetName,
            data: currentData
          });

          if (response.data.success) {
            // Update state if sheet changed or just to stay synced
            if (response.data.sheet !== currentData.sheetName || response.data.rowId !== currentData.rowId) {
                updateFormData({
                    rowId: response.data.rowId,
                    sheetName: response.data.sheet
                });
            }
            console.log("Sync Success: Updated Row", response.data.rowId);
          }
        }
      } catch (error) {
        console.error("Sync Error:", error);
      }
    }, 500);
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
      panVerified: false,
      rowId: null,
      sheetName: null
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm, syncLead }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);
