import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    // Customer Information Section
    title: 'Mr',
    surname: '',
    firstName: '',
    dateOfBirth: '',
    maritalStatus: 'single',
    nin: '',
    mothersMiddleName: '',
    religion: 'christian',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    nationality: 'Nigerian',
    residentialAddress: '',
    cityOfResidence: '',
    lgaOfResidence: '',
    stateOfResidence: '',
    countryOfResidence: 'Nigeria',
    email: '',
    phoneNumber: '',
    occupation: '',
    accountType: 'savings',
    
    // Mandate Section
    accountHolderName: '',
    bvn: '',
    accountHolderEmail: '',
    accountHolderPhone: '',
    accountHolderSignature: '',
    
    // Signature Section
    signedByAddress: '',
    signedByName: '',
    signedBySignature: '',
    
    // PEP Declaration Section
    pepIsIndividual: true,
    pepAreYouPep: 'no',
    pepAreYouRelatedToPep: 'no',
    pepProfile: '',
    pepRelationship: '',
    pepDeclarationName: '',
    pepDeclarationSignature: '',
    
    // Uploads
    uploads: {}
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const canvasRef3 = useRef(null);
  const [isDrawing1, setIsDrawing1] = useState(false);
  const [isDrawing2, setIsDrawing2] = useState(false);
  const [isDrawing3, setIsDrawing3] = useState(false);

  const startDrawing = (e, canvasRef, setter) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setter(true);
  };

  const draw = (e, canvasRef, isDrawing) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (e, canvasRef, setter, updateField) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setter(false);
    updateField(canvas.toDataURL());
  };

  const clearSignature = (canvasRef, updateField) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateField('');
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData({
        ...formData,
        uploads: { ...formData.uploads, [field]: file.name }
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Customer Info
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.nin.trim()) newErrors.nin = 'NIN is required';
    if (!formData.mothersMiddleName.trim()) newErrors.mothersMiddleName = 'Mother\'s maiden name is required';
    if (!formData.stateOfOrigin.trim()) newErrors.stateOfOrigin = 'State of origin is required';
    if (!formData.lgaOfOrigin.trim()) newErrors.lgaOfOrigin = 'LGA of origin is required';
    if (!formData.residentialAddress.trim()) newErrors.residentialAddress = 'Residential address is required';
    if (!formData.cityOfResidence.trim()) newErrors.cityOfResidence = 'City of residence is required';
    if (!formData.lgaOfResidence.trim()) newErrors.lgaOfResidence = 'LGA of residence is required';
    if (!formData.stateOfResidence.trim()) newErrors.stateOfResidence = 'State of residence is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!formData.phoneNumber.match(/^\d{10,}$/)) newErrors.phoneNumber = 'Valid phone number required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    
    // Mandate Section
    if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.bvn.match(/^\d{11}$/)) newErrors.bvn = 'Valid BVN (11 digits) is required';
    if (!formData.accountHolderEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.accountHolderEmail = 'Valid email required';
    if (!formData.accountHolderPhone.match(/^\d{10,}$/)) newErrors.accountHolderPhone = 'Valid phone number required';
    if (!formData.accountHolderSignature) newErrors.accountHolderSignature = 'Account holder signature is required';
    
    // Signature Section
    if (!formData.signedByName.trim()) newErrors.signedByName = 'Name is required';
    if (!formData.signedByAddress.trim()) newErrors.signedByAddress = 'Address is required';
    if (!formData.signedBySignature) newErrors.signedBySignature = 'Signature is required';
    
    // PEP Declaration
    if (!formData.pepDeclarationName.trim()) newErrors.pepDeclarationName = 'Name is required for PEP Declaration';
    if (!formData.pepDeclarationSignature) newErrors.pepDeclarationSignature = 'Signature is required for PEP Declaration';
    
    // Documents
    if (!formData.uploads.passport) newErrors.passport = 'Account holder passport photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyMyzeNQAyDGoXs3GAdJFQ3JYswjn-Ewi7jCFLbyKajFJuFvbiegR81rOZvh4W299Xn/exec', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          setSubmitted(true);
          console.log('Form submitted successfully');
        } else {
          alert('Submission failed. Please try again.');
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting form. Please check your connection and try again.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h1>
          <p className="text-slate-600 mb-4">
            Thanks for completing your Fidelity Bank account application, {formData.firstName}.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Your application has been received and will be processed within 2-3 business days.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                title: 'Mr',
                surname: '',
                firstName: '',
                dateOfBirth: '',
                maritalStatus: 'single',
                nin: '',
                mothersMiddleName: '',
                religion: 'christian',
                stateOfOrigin: '',
                lgaOfOrigin: '',
                nationality: 'Nigerian',
                residentialAddress: '',
                cityOfResidence: '',
                lgaOfResidence: '',
                stateOfResidence: '',
                countryOfResidence: 'Nigeria',
                email: '',
                phoneNumber: '',
                occupation: '',
                accountType: 'savings',
                accountHolderName: '',
                bvn: '',
                accountHolderEmail: '',
                accountHolderPhone: '',
                accountHolderSignature: '',
                signedByAddress: '',
                signedByName: '',
                signedBySignature: '',
                pepIsIndividual: true,
                pepAreYouPep: 'no',
                pepAreYouRelatedToPep: 'no',
                pepProfile: '',
                pepRelationship: '',
                pepDeclarationName: '',
                pepDeclarationSignature: '',
                uploads: {}
              });
            }}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Fidelity Bank</h1>
          <p className="text-slate-300 text-lg">Account Opening Application</p>
          <div className="h-1 w-16 bg-emerald-500 mt-4"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-2xl p-8">
          
          {/* Customer Information Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
              Customer Information
            </h2>

            <div className="space-y-4">
              {/* Title and Name */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Surname *</label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.surname ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Surname"
                  />
                  {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="First Name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
              </div>

              {/* Date of Birth and Marital Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Identification Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mode of Identification *</label>
                  <select
                    value="nin"
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                  >
                    <option value="nin">NIN (National Identification Number)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">NIN is required for account opening</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NIN Number *</label>
                  <input
                    type="text"
                    value={formData.nin}
                    onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.nin ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Enter your NIN"
                    maxLength="11"
                  />
                  {errors.nin && <p className="text-red-500 text-xs mt-1">{errors.nin}</p>}
                </div>
              </div>

              {/* Family and Religion */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mother's Maiden Name *</label>
                  <input
                    type="text"
                    value={formData.mothersMiddleName}
                    onChange={(e) => setFormData({ ...formData, mothersMiddleName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.mothersMiddleName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Mother's maiden name"
                  />
                  {errors.mothersMiddleName && <p className="text-red-500 text-xs mt-1">{errors.mothersMiddleName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Religion *</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="christian">Christian</option>
                    <option value="muslim">Muslim</option>
                    <option value="others">Others</option>
                  </select>
                </div>
              </div>

              {/* Origin */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State of Origin *</label>
                  <input
                    type="text"
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.stateOfOrigin ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="State of origin"
                  />
                  {errors.stateOfOrigin && <p className="text-red-500 text-xs mt-1">{errors.stateOfOrigin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LGA of Origin *</label>
                  <input
                    type="text"
                    value={formData.lgaOfOrigin}
                    onChange={(e) => setFormData({ ...formData, lgaOfOrigin: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.lgaOfOrigin ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Local Government Area of origin"
                  />
                  {errors.lgaOfOrigin && <p className="text-red-500 text-xs mt-1">{errors.lgaOfOrigin}</p>}
                </div>
              </div>

              {/* Nationality */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nationality *</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Nigerian">Nigerian</option>
                    <option value="others">Others (specify below)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country of Residence *</label>
                  <input
                    type="text"
                    value={formData.countryOfResidence}
                    onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Country of residence"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.residentialAddress ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Street address"
                />
                {errors.residentialAddress && <p className="text-red-500 text-xs mt-1">{errors.residentialAddress}</p>}
              </div>

              {/* City, LGA, State of Residence */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City of Residence *</label>
                  <input
                    type="text"
                    value={formData.cityOfResidence}
                    onChange={(e) => setFormData({ ...formData, cityOfResidence: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.cityOfResidence ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.cityOfResidence && <p className="text-red-500 text-xs mt-1">{errors.cityOfResidence}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LGA of Residence *</label>
                  <input
                    type="text"
                    value={formData.lgaOfResidence}
                    onChange={(e) => setFormData({ ...formData, lgaOfResidence: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.lgaOfResidence ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="LGA"
                  />
                  {errors.lgaOfResidence && <p className="text-red-500 text-xs mt-1">{errors.lgaOfResidence}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State of Residence *</label>
                  <input
                    type="text"
                    value={formData.stateOfResidence}
                    onChange={(e) => setFormData({ ...formData, stateOfResidence: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.stateOfResidence ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.stateOfResidence && <p className="text-red-500 text-xs mt-1">{errors.stateOfResidence}</p>}
                </div>
              </div>

              {/* Contact and Professional Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.email ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="10 digits minimum"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Occupation and Account Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Occupation *</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.occupation ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Your occupation"
                  />
                  {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Type *</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="fixed">Fixed Deposit Account</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Mandate Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
              Mandate Section (i)
            </h2>

            <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder's Name *</label>
                  <input
                    type="text"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.accountHolderName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Full name"
                  />
                  {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">BVN (11 digits) *</label>
                  <input
                    type="text"
                    value={formData.bvn}
                    onChange={(e) => setFormData({ ...formData, bvn: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.bvn ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="11-digit BVN"
                    maxLength="11"
                  />
                  {errors.bvn && <p className="text-red-500 text-xs mt-1">{errors.bvn}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.accountHolderPhone}
                    onChange={(e) => setFormData({ ...formData, accountHolderPhone: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.accountHolderPhone ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="10+ digits"
                  />
                  {errors.accountHolderPhone && <p className="text-red-500 text-xs mt-1">{errors.accountHolderPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.accountHolderEmail}
                    onChange={(e) => setFormData({ ...formData, accountHolderEmail: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.accountHolderEmail ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.accountHolderEmail && <p className="text-red-500 text-xs mt-1">{errors.accountHolderEmail}</p>}
                </div>
              </div>

              {/* Account Holder Signature */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Account Holder's Signature *</label>
                <div className={`border-2 rounded-lg overflow-hidden ${errors.accountHolderSignature ? 'border-red-500' : 'border-slate-300'}`}>
                  <canvas
                    ref={canvasRef1}
                    width={500}
                    height={120}
                    onMouseDown={(e) => startDrawing(e, canvasRef1, setIsDrawing1)}
                    onMouseMove={(e) => draw(e, canvasRef1, isDrawing1)}
                    onMouseUp={(e) => stopDrawing(e, canvasRef1, setIsDrawing1, (sig) => setFormData({ ...formData, accountHolderSignature: sig }))}
                    onMouseLeave={(e) => stopDrawing(e, canvasRef1, setIsDrawing1, (sig) => setFormData({ ...formData, accountHolderSignature: sig }))}
                    className="w-full bg-white cursor-crosshair"
                    style={{ touchAction: 'none' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => clearSignature(canvasRef1, (sig) => setFormData({ ...formData, accountHolderSignature: sig }))}
                  className="text-sm px-4 py-2 mt-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Clear Signature
                </button>
                {errors.accountHolderSignature && <p className="text-red-500 text-xs mt-2">{errors.accountHolderSignature}</p>}
              </div>

              {/* Passport Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Account Holder's Passport Photo *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload('passport', e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {formData.uploads.passport ? (
                      <span className="text-emerald-600 font-medium">✓ {formData.uploads.passport}</span>
                    ) : (
                      <>Click to upload or drag and drop</>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, or PDF (max 5MB)</p>
                </div>
                {errors.passport && <p className="text-red-500 text-xs mt-2">{errors.passport}</p>}
              </div>
            </div>
          </div>

          {/* Signature Section - For witness/officer */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
              Authorized Signatory
            </h2>

            <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-slate-600 mb-4">
                This section is for the authorized officer or witness who is facilitating this account opening.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                <input
                  type="text"
                  value={formData.signedByAddress}
                  onChange={(e) => setFormData({ ...formData, signedByAddress: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.signedByAddress ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Street address"
                />
                {errors.signedByAddress && <p className="text-red-500 text-xs mt-1">{errors.signedByAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.signedByName}
                  onChange={(e) => setFormData({ ...formData, signedByName: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.signedByName ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Full name"
                />
                {errors.signedByName && <p className="text-red-500 text-xs mt-1">{errors.signedByName}</p>}
              </div>

              {/* Signatory Signature */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Signature *</label>
                <div className={`border-2 rounded-lg overflow-hidden ${errors.signedBySignature ? 'border-red-500' : 'border-slate-300'}`}>
                  <canvas
                    ref={canvasRef2}
                    width={500}
                    height={120}
                    onMouseDown={(e) => startDrawing(e, canvasRef2, setIsDrawing2)}
                    onMouseMove={(e) => draw(e, canvasRef2, isDrawing2)}
                    onMouseUp={(e) => stopDrawing(e, canvasRef2, setIsDrawing2, (sig) => setFormData({ ...formData, signedBySignature: sig }))}
                    onMouseLeave={(e) => stopDrawing(e, canvasRef2, setIsDrawing2, (sig) => setFormData({ ...formData, signedBySignature: sig }))}
                    className="w-full bg-white cursor-crosshair"
                    style={{ touchAction: 'none' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => clearSignature(canvasRef2, (sig) => setFormData({ ...formData, signedBySignature: sig }))}
                  className="text-sm px-4 py-2 mt-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Clear Signature
                </button>
                {errors.signedBySignature && <p className="text-red-500 text-xs mt-2">{errors.signedBySignature}</p>}
              </div>
            </div>
          </div>

          {/* PEP Declaration Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
              Politically Exposed Persons (PEP) Declaration
            </h2>

            <div className="space-y-6 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              {/* Definition Box */}
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-slate-700 mb-3">
                  <span className="font-bold">Definition:</span> Politically Exposed Persons (PEPs) are individuals who are or have been entrusted with prominent public functions in Nigeria or in foreign countries.
                </p>
                <p className="text-xs text-slate-600 mb-2">This includes:</p>
                <ul className="text-xs text-slate-600 space-y-1 ml-4">
                  <li>• Head of State or of Government</li>
                  <li>• Senior politician</li>
                  <li>• Senior government, judicial or military official</li>
                  <li>• Member of ruling royal family</li>
                  <li>• Senior executive of state-owned corporation</li>
                  <li>• Important Political party officials</li>
                  <li>• Immediate family members, relatives, advisers, or business associates of above</li>
                </ul>
              </div>

              {/* Section 2: Details of PEP */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">2. Details of the Politically Exposed Person</h3>

                {/* Individual vs Corporate */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pepType"
                      checked={formData.pepIsIndividual}
                      onChange={() => setFormData({ ...formData, pepIsIndividual: true })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Individual</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pepType"
                      checked={!formData.pepIsIndividual}
                      onChange={() => setFormData({ ...formData, pepIsIndividual: false })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">Corporate</span>
                  </label>
                </div>

                {/* Question 1: Are you a PEP? */}
                <div className="bg-white p-4 rounded border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-3">1. Are you a PEP? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pepAreYouPep"
                        value="yes"
                        checked={formData.pepAreYouPep === 'yes'}
                        onChange={(e) => setFormData({ ...formData, pepAreYouPep: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pepAreYouPep"
                        value="no"
                        checked={formData.pepAreYouPep === 'no'}
                        onChange={(e) => setFormData({ ...formData, pepAreYouPep: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Question 2: Are you related to a PEP? */}
                <div className="bg-white p-4 rounded border border-slate-200">
                  <label className="block text-sm font-medium text-slate-700 mb-3">2. Are you related to a PEP? *</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pepAreYouRelated"
                        value="yes"
                        checked={formData.pepAreYouRelatedToPep === 'yes'}
                        onChange={(e) => setFormData({ ...formData, pepAreYouRelatedToPep: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="pepAreYouRelated"
                        value="no"
                        checked={formData.pepAreYouRelatedToPep === 'no'}
                        onChange={(e) => setFormData({ ...formData, pepAreYouRelatedToPep: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Question 3: If you are a PEP, indicate profile */}
                {formData.pepAreYouPep === 'yes' && (
                  <div className="bg-white p-4 rounded border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-3">3. If you are a PEP, please indicate the profile: *</label>
                    <div className="space-y-2">
                      {[
                        { value: 'head_of_state', label: 'Head of State or of Government' },
                        { value: 'senior_politician', label: 'Senior politician' },
                        { value: 'senior_government', label: 'Senior government, judicial or military official' },
                        { value: 'royal_family', label: 'Member of ruling royal family' },
                        { value: 'senior_executive', label: 'Senior executive of state-owned enterprise' },
                        { value: 'political_official', label: 'Important political party official' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="pepProfile"
                            value={option.value}
                            checked={formData.pepProfile === option.value}
                            onChange={(e) => setFormData({ ...formData, pepProfile: e.target.value })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question 4: If related to PEP, indicate relationship */}
                {formData.pepAreYouRelatedToPep === 'yes' && (
                  <div className="bg-white p-4 rounded border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-3">4. If you are related to a PEP, please indicate your relationship: *</label>
                    <div className="space-y-2">
                      {formData.pepIsIndividual ? (
                        // Individual relationships
                        [
                          { value: 'family', label: 'Family' },
                          { value: 'relatives', label: 'Relatives' },
                          { value: 'adviser', label: 'Adviser' },
                          { value: 'business_associate', label: 'Business Associate' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pepRelationship === option.value}
                              onChange={(e) => setFormData({ ...formData, pepRelationship: e.target.checked ? option.value : '' })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-slate-700">{option.label}</span>
                          </label>
                        ))
                      ) : (
                        // Corporate relationships
                        [
                          { value: 'director', label: 'Director' },
                          { value: 'beneficial_owner', label: 'Beneficial Owner' },
                          { value: 'adviser', label: 'Adviser' },
                          { value: 'business_associate', label: 'Business Associate' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pepRelationship === option.value}
                              onChange={(e) => setFormData({ ...formData, pepRelationship: e.target.checked ? option.value : '' })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-slate-700">{option.label}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Declarations and Signature */}
              <div className="space-y-4 bg-white p-4 rounded border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800">3. Declarations and Signature</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.pepDeclarationName}
                    onChange={(e) => setFormData({ ...formData, pepDeclarationName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pepDeclarationName ? 'border-red-500' : 'border-slate-300'
                    }`}
                    placeholder="Full name for signature"
                  />
                  {errors.pepDeclarationName && <p className="text-red-500 text-xs mt-1">{errors.pepDeclarationName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Signature *</label>
                  <div className={`border-2 rounded-lg overflow-hidden ${errors.pepDeclarationSignature ? 'border-red-500' : 'border-slate-300'}`}>
                    <canvas
                      ref={canvasRef3}
                      width={500}
                      height={120}
                      onMouseDown={(e) => startDrawing(e, canvasRef3, setIsDrawing3)}
                      onMouseMove={(e) => draw(e, canvasRef3, isDrawing3)}
                      onMouseUp={(e) => stopDrawing(e, canvasRef3, setIsDrawing3, (sig) => setFormData({ ...formData, pepDeclarationSignature: sig }))}
                      onMouseLeave={(e) => stopDrawing(e, canvasRef3, setIsDrawing3, (sig) => setFormData({ ...formData, pepDeclarationSignature: sig }))}
                      className="w-full bg-white cursor-crosshair"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => clearSignature(canvasRef3, (sig) => setFormData({ ...formData, pepDeclarationSignature: sig }))}
                    className="text-sm px-4 py-2 mt-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                  >
                    Clear Signature
                  </button>
                  {errors.pepDeclarationSignature && <p className="text-red-500 text-xs mt-2">{errors.pepDeclarationSignature}</p>}
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
                  I/We declare that the above information given in this form is true and accurate, and that I have not withheld any material facts or information from Fidelity Bank Management. I/We undertake to furnish Fidelity Bank with additional information as they may require at any time and undertake to update Fidelity Bank with any changes with regards to the information stated herein.
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600">
              By submitting this form, you agree to Fidelity Bank's terms and conditions. Your information will be processed securely in accordance with data protection regulations.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg"
          >
            Submit Application
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Secure • Encrypted • Compliant with CBN Regulations
        </p>
      </div>
    </div>
  );
}
