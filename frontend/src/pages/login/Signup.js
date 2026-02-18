import React, { useState, useRef, useEffect } from "react";
import logo from "../images/logo.png";
import { registerInstitution } from "../api/institutionSignup";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const formRef = useRef(null);

  // Form data state
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "",
    institutionEmail: "",
    institutionPhone: "",
    institutionAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    designation: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeData: false,
    subscribeUpdates: false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // Update password strength
    if (name === "password") {
      updatePasswordStrength(value);
    }
  };

  // Update password strength
  const updatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    let strengthText = "weak";
    if (strength === 2) strengthText = "medium";
    else if (strength >= 3) strengthText = "strong";

    setPasswordStrength(strengthText);
  };

  // Field validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "institutionEmail":
      case "adminEmail":
        if (!value) error = "This field is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;
      case "password":
        if (!value) error = "This field is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
      case "agreeTerms":
        if (!value) error = "You must agree to the Terms of Service";
        break;
      case "agreeData":
        if (!value) error = "You must consent to data processing";
        break;
      default:
        if (!value && name !== "subscribeUpdates") error = "This field is required";
    }

    return error;
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 1:
        ["institutionName", "institutionType", "institutionEmail", "institutionPhone", "institutionAddress", "city", "state", "country", "zipCode"].forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case 2:
        ["adminName", "adminEmail", "adminPhone", "designation", "password", "confirmPassword"].forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case 3:
        ["agreeTerms", "agreeData"].forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Navigation functions
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountTypeSelect = () => {
    setShowInstitutionForm(true);
    setCurrentStep(1);
  };

  const handleBackToAccountType = () => {
    setShowInstitutionForm(false);
    setCurrentStep(1);
    setFormData({
      institutionName: "",
      institutionType: "",
      institutionEmail: "",
      institutionPhone: "",
      institutionAddress: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      designation: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      agreeData: false,
      subscribeUpdates: false,
    });
    setErrors({});
  };

  // Build payload for API
  const buildInstitutionPayload = () => {
    return {
      institutionName: formData.institutionName,
      institutionType: formData.institutionType,
      institutionEmail: formData.institutionEmail,
      institutionPhone: formData.institutionPhone,
      address: formData.institutionAddress,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPhone: formData.adminPhone,
      designation: formData.designation,
      password: formData.password
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    const payload = buildInstitutionPayload();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await registerInstitution(payload);
      setShowSuccessScreen(true);
      setShowInstitutionForm(false);
    } catch (error) {
      console.error("Backend error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get strength color
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  // Get strength text
  const getStrengthText = () => {
    switch (passwordStrength) {
      case "weak": return "Weak";
      case "medium": return "Medium";
      case "strong": return "Strong";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-50"></div>
    

      {/* Main Container */}
      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 lg:p-12 flex flex-col">
          {/* Back to Home */}
          <a 
            href="/" 
            className="inline-flex items-center text-blue-100 hover:text-white transition-colors duration-200 mb-12 group"
          >
            <svg 
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>

          {/* Brand Logo */}
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <img src={logo} alt="Attenza Logo" className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Attenza</h1>
            </div>
            <p className="text-blue-100 text-lg max-w-md">
              Join the future of Smart Curriculum & Personalized System Management
            </p>
          </div>

          {/* Benefits List */}
          <div className="mt-auto space-y-6">
            <h3 className="text-xl font-semibold mb-4">Why choose Attenza?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Modal Tracking</h4>
                  <p className="text-blue-200 text-sm">Dynamic Session based QR code attendance</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Smart Planner</h4>
                  <p className="text-blue-200 text-sm">Smart Curriculum & Personalized System Management</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Real-time Analytics</h4>
                  <p className="text-blue-200 text-sm">Comprehensive insights and compliance reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Forms */}
        <div className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Account Type Selection */}
            {!showInstitutionForm && !showSuccessScreen && (
              <div className="animate-fade-in">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Started with Attenza</h2>
                  <p className="text-gray-600">Click below to begin the journey!</p>
                </div>

                {/* Institution Card */}
                <div 
                  onClick={handleAccountTypeSelect}
                  className="relative bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-slide-up"
                >

                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Institution / College</h3>
                      <p className="text-gray-600 mb-4">
                        Register your educational institution and get full access to all features including attendance tracking, smart planning, and analytics.
                      </p>
                      <div className="flex items-center text-blue-600 font-medium">
                        <span>Get Started</span>
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Institution Registration Form */}
            {showInstitutionForm && !showSuccessScreen && (
              <div className="animate-fade-in">
                {/* Back Button */}
                <button
                  onClick={handleBackToAccountType}
                  className="flex items-center text-gray-600 hover:text-gray-900 mb-8 group transition-colors"
                >
                  <svg 
                    className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Account Selection
                </button>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-10">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                          ${currentStep >= step 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                          }
                        `}>
                          {step}
                        </div>
                        <span className={`
                          ml-2 text-sm font-medium hidden sm:block
                          ${currentStep >= step ? 'text-gray-900' : 'text-gray-500'}
                        `}>
                          {step === 1 ? 'Institution' : step === 2 ? 'Admin' : 'Review'}
                        </span>
                      </div>
                      {step < 3 && (
                        <div className={`
                          flex-1 h-1 mx-4
                          ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                        `}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Institution Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Institution Details</h2>
                        <p className="text-gray-600">Tell us about your institution</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institution Name *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="institutionName"
                              value={formData.institutionName}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.institutionName ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Enter institution name"
                            />
                          </div>
                          {errors.institutionName && (
                            <p className="mt-1 text-sm text-red-600">{errors.institutionName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Institution Type *
                          </label>
                          <select
                            name="institutionType"
                            value={formData.institutionType}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.institutionType ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select type</option>
                            <option value="university">University</option>
                            <option value="college">College</option>
                            <option value="school">School</option>
                            <option value="training">Training Institute</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.institutionType && (
                            <p className="mt-1 text-sm text-red-600">{errors.institutionType}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Official Email *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="institutionEmail"
                              value={formData.institutionEmail}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.institutionEmail ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="contact@institution.edu"
                            />
                          </div>
                          {errors.institutionEmail && (
                            <p className="mt-1 text-sm text-red-600">{errors.institutionEmail}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <input
                              type="tel"
                              name="institutionPhone"
                              value={formData.institutionPhone}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.institutionPhone ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                          {errors.institutionPhone && (
                            <p className="mt-1 text-sm text-red-600">{errors.institutionPhone}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address *
                          </label>
                          <textarea
                            name="institutionAddress"
                            value={formData.institutionAddress}
                            onChange={handleInputChange}
                            rows="3"
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.institutionAddress ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter complete address"
                          />
                          {errors.institutionAddress && (
                            <p className="mt-1 text-sm text-red-600">{errors.institutionAddress}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.city ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="City"
                          />
                          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.state ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="State"
                          />
                          {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.country ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select country</option>
                            <option value="US">United States</option>
                            <option value="IN">India</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.zipCode ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="ZIP Code"
                          />
                          {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center"
                        >
                          Continue to Admin Details
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Admin Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Account Details</h2>
                        <p className="text-gray-600">Tell us about the institution admin</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Full Name *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="adminName"
                              value={formData.adminName}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.adminName ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Enter your full name"
                            />
                          </div>
                          {errors.adminName && <p className="mt-1 text-sm text-red-600">{errors.adminName}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="adminEmail"
                              value={formData.adminEmail}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.adminEmail ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="admin@institution.edu"
                            />
                          </div>
                          {errors.adminEmail && <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <input
                              type="tel"
                              name="adminPhone"
                              value={formData.adminPhone}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.adminPhone ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                          {errors.adminPhone && <p className="mt-1 text-sm text-red-600">{errors.adminPhone}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Designation *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="designation"
                              value={formData.designation}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.designation ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Principal, Dean, Director"
                            />
                          </div>
                          {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Create a strong password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          
                          {/* Password Strength Indicator */}
                          {formData.password && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Password strength:</span>
                                <span className={`text-xs font-medium ${
                                  passwordStrength === 'weak' ? 'text-red-600' :
                                  passwordStrength === 'medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {getStrengthText()}
                                </span>
                              </div>
                              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                                    passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                                    'w-full bg-green-500'
                                  }`}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Re-enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 flex justify-between">
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center"
                        >
                          Continue to Review
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
{/* Step 3: Review and Submit */}
{currentStep === 3 && (
  <div className="space-y-6 animate-slide-up">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
      <p className="text-gray-600">Please review and confirm all details before submission</p>
    </div>

    {/* Comprehensive Summary Cards */}
    <div className="space-y-6 mb-8">
      {/* Institution Details Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Institution Details
          </h3>
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            Edit
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Name</p>
              <p className="font-medium text-gray-900">{formData.institutionName || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Type</p>
              <p className="font-medium text-gray-900">{formData.institutionType || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
              <p className="font-medium text-gray-900">{formData.institutionEmail || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
              <p className="font-medium text-gray-900">{formData.institutionPhone || "-"}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Address</p>
              <p className="font-medium text-gray-900">{formData.institutionAddress || "-"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">City</p>
                <p className="font-medium text-gray-900">{formData.city || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">State</p>
                <p className="font-medium text-gray-900">{formData.state || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Country</p>
                <p className="font-medium text-gray-900">{formData.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">ZIP Code</p>
                <p className="font-medium text-gray-900">{formData.zipCode || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Details Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Admin Account Details
          </h3>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            Edit
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Full Name</p>
              <p className="font-medium text-gray-900">{formData.adminName || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
              <p className="font-medium text-gray-900">{formData.adminEmail || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
              <p className="font-medium text-gray-900">{formData.adminPhone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Designation</p>
              <p className="font-medium text-gray-900">{formData.designation || "-"}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Password Strength</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                      passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength === 'weak' ? 'text-red-600' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Account Type</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                Institution Administrator
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Verification Status</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                Pending Review
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Login Credentials</p>
              <p className="text-sm text-gray-600">Will be sent to: {formData.adminEmail || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Registration Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">14</p>
            <p className="text-xs text-gray-600">Fields Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">100%</p>
            <p className="text-xs text-gray-600">Form Complete</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">1-2</p>
            <p className="text-xs text-gray-600">Days for Review</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">24/7</p>
            <p className="text-xs text-gray-600">Support Available</p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>✓ All required information has been provided</p>
          <p>✓ Email verification will be sent upon approval</p>
          <p>✓ Access to dashboard within 24 hours of approval</p>
        </div>
      </div>
    </div>

    {/* Terms and Conditions */}
    <div className="space-y-4">
      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-700 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 font-medium">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
      </div>

      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeData"
            checked={formData.agreeData}
            onChange={handleInputChange}
            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm text-gray-700">
            I consent to data processing for attendance tracking and analytics
          </span>
        </label>
        {errors.agreeData && <p className="mt-1 text-sm text-red-600">{errors.agreeData}</p>}
      </div>

      <div>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="subscribeUpdates"
            checked={formData.subscribeUpdates}
            onChange={handleInputChange}
            className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span className="text-sm text-gray-700">
            Send me product updates and announcements (optional)
          </span>
        </label>
      </div>
    </div>
    

    {/* Submit Error */}
    {submitError && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-red-600">{submitError}</p>
      </div>
    )}

    <div className="pt-6 border-t border-gray-200 flex justify-between">
      <button
        type="button"
        onClick={handlePrev}
        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
                  "Complete Registration"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  </div>
)}

            {/* Success Screen */}
            {showSuccessScreen && (
              <div className="animate-fade-in text-center">
                <div className="mb-8">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your institution registration has been received successfully! Our team will review your application.
                    Once approved, a confirmation email will be sent to {formData.adminEmail}.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href="/login"
                    className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Go to Login
                  </a>
                  <a
                    href="/"
                    className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
