import { useState } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle, 
  X, 
  ArrowRight,
  Shield,
  Clock,
  Award
} from 'lucide-react';

export default function LoanApplication({ isOpen, onClose, results }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    registrationNumber: '',
    yearsInBusiness: '',
    industryType: '',
    
    // Address Information
    businessAddress: '',
    city: '',
    province: '',
    postalCode: '',
    
    // Financial Information
    loanAmount: results?.loanAmount || '',
    loanPurpose: '',
    monthlyTurnover: '',
    annualRevenue: '',
    existingDebt: '',
    
    // Documents
    uploadedDocs: []
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      uploadedDocs: [...prev.uploadedDocs, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocs: prev.uploadedDocs.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  const InputField = ({ label, type = 'text', field, required = true, placeholder, options }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-standard-blue">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-standard-blue focus:border-transparent"
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-standard-blue focus:border-transparent"
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-standard-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-standard-blue mb-4">Application Submitted!</h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your GreenCred loan application. Our team will review your application and ESG score, 
            and contact you within 24-48 hours.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Your ESG Benefits:</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Interest Rate Discount: {results?.discount}%</li>
              <li>• Monthly Savings: R{results?.monthlySavings?.toLocaleString()}</li>
              <li>• GreenCred Rating: {results?.rating}</li>
            </ul>
          </div>
          
          <div className="text-sm text-gray-500 mb-6">
            <p className="font-semibold mb-2">Reference Number: GC-{Date.now().toString().slice(-6)}</p>
            <p>Please save this reference number for tracking your application.</p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-standard-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-standard-light-blue transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-standard-blue to-standard-light-blue text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Standard Bank Loan Application</h2>
                <p className="text-blue-100">GreenCred Sustainable Finance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step ? 'bg-white text-standard-blue' : 'bg-blue-400 text-white'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-white' : 'bg-blue-400'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-blue-100 mt-2">
            <span>Personal</span>
            <span>Business</span>
            <span>Financial</span>
            <span>Documents</span>
          </div>
        </div>

        {/* ESG Benefits Banner */}
        <div className="bg-green-50 border-l-4 border-standard-green p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-standard-green" />
              <div>
                <h3 className="font-semibold text-standard-green">Your ESG Benefits Applied</h3>
                <p className="text-sm text-green-700">
                  {results?.discount}% interest discount • R{results?.monthlySavings?.toLocaleString()} monthly savings • {results?.rating} rating
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-6 h-6 text-standard-blue" />
                <h3 className="text-xl font-bold text-standard-blue">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  field="firstName"
                  placeholder="Enter your first name"
                />
                <InputField
                  label="Last Name"
                  field="lastName"
                  placeholder="Enter your last name"
                />
                <InputField
                  label="ID Number"
                  field="idNumber"
                  placeholder="Enter your ID number"
                />
                <InputField
                  label="Email Address"
                  type="email"
                  field="email"
                  placeholder="Enter your email address"
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  field="phone"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="w-6 h-6 text-standard-blue" />
                <h3 className="text-xl font-bold text-standard-blue">Business Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Business Name"
                  field="businessName"
                  placeholder="Enter your business name"
                />
                <InputField
                  label="Business Type"
                  type="select"
                  field="businessType"
                  placeholder="Select business type"
                  options={[
                    { value: 'pty-ltd', label: '(Pty) Ltd' },
                    { value: 'sole-proprietor', label: 'Sole Proprietorship' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'trust', label: 'Trust' },
                    { value: 'npc', label: 'Non-Profit Company' }
                  ]}
                />
                <InputField
                  label="Registration Number"
                  field="registrationNumber"
                  placeholder="Enter registration number"
                />
                <InputField
                  label="Years in Business"
                  type="number"
                  field="yearsInBusiness"
                  placeholder="Years operating"
                />
                <InputField
                  label="Industry Type"
                  type="select"
                  field="industryType"
                  placeholder="Select industry"
                  options={[
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'services', label: 'Professional Services' },
                    { value: 'technology', label: 'Technology' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'construction', label: 'Construction' },
                    { value: 'agriculture', label: 'Agriculture' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-standard-blue">Business Address</h4>
                <div className="grid grid-cols-1 gap-4">
                  <InputField
                    label="Street Address"
                    field="businessAddress"
                    placeholder="Enter business address"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="City"
                      field="city"
                      placeholder="City"
                    />
                    <InputField
                      label="Province"
                      type="select"
                      field="province"
                      placeholder="Select province"
                      options={[
                        { value: 'gauteng', label: 'Gauteng' },
                        { value: 'western-cape', label: 'Western Cape' },
                        { value: 'kwazulu-natal', label: 'KwaZulu-Natal' },
                        { value: 'eastern-cape', label: 'Eastern Cape' },
                        { value: 'free-state', label: 'Free State' },
                        { value: 'limpopo', label: 'Limpopo' },
                        { value: 'mpumalanga', label: 'Mpumalanga' },
                        { value: 'northern-cape', label: 'Northern Cape' },
                        { value: 'north-west', label: 'North West' }
                      ]}
                    />
                    <InputField
                      label="Postal Code"
                      field="postalCode"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <DollarSign className="w-6 h-6 text-standard-blue" />
                <h3 className="text-xl font-bold text-standard-blue">Financial Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Loan Amount (R)"
                  type="number"
                  field="loanAmount"
                  placeholder="Enter loan amount"
                />
                <InputField
                  label="Loan Purpose"
                  type="select"
                  field="loanPurpose"
                  placeholder="Select loan purpose"
                  options={[
                    { value: 'working-capital', label: 'Working Capital' },
                    { value: 'equipment', label: 'Equipment Purchase' },
                    { value: 'expansion', label: 'Business Expansion' },
                    { value: 'inventory', label: 'Inventory Purchase' },
                    { value: 'property', label: 'Commercial Property' },
                    { value: 'refinancing', label: 'Debt Refinancing' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
                <InputField
                  label="Monthly Turnover (R)"
                  type="number"
                  field="monthlyTurnover"
                  placeholder="Average monthly turnover"
                />
                <InputField
                  label="Annual Revenue (R)"
                  type="number"
                  field="annualRevenue"
                  placeholder="Annual revenue"
                />
                <InputField
                  label="Existing Debt (R)"
                  type="number"
                  field="existingDebt"
                  placeholder="Total existing business debt"
                  required={false}
                />
              </div>

              {/* Loan Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-standard-blue mb-4">Loan Summary with ESG Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Requested Amount</p>
                    <p className="text-xl font-bold text-standard-blue">R{formData.loanAmount ? parseInt(formData.loanAmount).toLocaleString() : results?.loanAmount?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Interest Rate (with ESG discount)</p>
                    <p className="text-xl font-bold text-standard-green">{results?.discountedRate}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Est. Monthly Payment</p>
                    <p className="text-xl font-bold text-standard-blue">R{results?.monthlyPayment?.toLocaleString() || 'TBD'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-6 h-6 text-standard-blue" />
                <h3 className="text-xl font-bold text-standard-blue">Required Documents</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Document Checklist</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Copy of ID document</li>
                    <li>• Company registration documents</li>
                    <li>• 6 months bank statements</li>
                    <li>• Financial statements (last 2 years)</li>
                    <li>• Tax clearance certificate</li>
                    <li>• ESG documentation (if available)</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <label className="cursor-pointer">
                    <span className="text-standard-blue font-semibold hover:text-standard-light-blue">
                      Click to upload files
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (max 10MB each)</p>
                </div>

                {formData.uploadedDocs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-standard-blue">Uploaded Documents</h4>
                    {formData.uploadedDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" required />
                  <div className="text-sm text-gray-600">
                    <p>I agree to Standard Bank's <span className="text-standard-blue font-semibold">Terms and Conditions</span> and <span className="text-standard-blue font-semibold">Privacy Policy</span>. I consent to credit checks and verification of the information provided.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-standard-blue text-standard-blue rounded-lg hover:bg-blue-50 transition duration-200"
              >
                Previous
              </button>
            )}
            
            <div className="ml-auto">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-standard-blue text-white rounded-lg hover:bg-standard-light-blue transition duration-200"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-8 py-3 bg-standard-green text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}