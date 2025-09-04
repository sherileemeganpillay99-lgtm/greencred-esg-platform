import { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Calendar,
  TrendingUp,
  Shield,
  RefreshCw
} from 'lucide-react';

export default function ApplicationStatus() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = async () => {
    if (!referenceNumber.trim()) {
      setError('Please enter a reference number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/application-status?referenceNumber=${encodeURIComponent(referenceNumber.trim())}`);
      const result = await response.json();

      if (result.success) {
        setApplicationStatus(result.data);
      } else {
        setError(result.message || 'Application not found');
      }
    } catch (error) {
      console.error('Status check error:', error);
      setError('Failed to check application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkStatus();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending_documents': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return Clock;
      case 'under_review': return FileText;
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      case 'pending_documents': return FileText;
      default: return Clock;
    }
  };

  const StatusStep = ({ step, isCompleted, isCurrent, isLast }) => (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        isCompleted ? 'bg-green-500 text-white' : 
        isCurrent ? 'bg-standard-blue text-white' : 
        'bg-gray-200 text-gray-400'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Clock className="w-4 h-4" />
        )}
      </div>
      <span className={`ml-2 text-sm ${
        isCompleted || isCurrent ? 'text-gray-800 font-semibold' : 'text-gray-500'
      }`}>
        {step}
      </span>
      {!isLast && (
        <div className={`ml-4 w-16 h-px ${
          isCompleted ? 'bg-green-500' : 'bg-gray-200'
        }`} />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-standard-blue">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-standard-blue mb-2">Track Your Application</h2>
          <p className="text-standard-gray">Enter your reference number to check your loan application status</p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter reference number (e.g., GCLOAN-ABC123)"
              className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-standard-blue focus:border-transparent"
            />
            <button
              onClick={checkStatus}
              disabled={loading}
              className="bg-standard-blue hover:bg-standard-light-blue disabled:opacity-50 text-white px-6 py-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {applicationStatus && (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Application Status</h3>
                  <p className="text-gray-600">Reference: {applicationStatus.referenceNumber}</p>
                </div>
                <div className={`px-4 py-2 rounded-full ${getStatusColor(applicationStatus.status)}`}>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(applicationStatus.status);
                      return <StatusIcon className="w-4 h-4" />;
                    })()}
                    <span className="font-semibold capitalize">
                      {applicationStatus.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Submitted</p>
                  <p className="font-semibold">
                    {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Current Stage</p>
                  <p className="font-semibold">{applicationStatus.currentStage}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected Completion</p>
                  <p className="font-semibold">
                    {new Date(applicationStatus.estimatedCompletionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-6">Application Progress</h4>
              
              <div className="space-y-4">
                {applicationStatus.completedStages.map((stage, index) => (
                  <StatusStep
                    key={index}
                    step={stage}
                    isCompleted={true}
                    isCurrent={false}
                    isLast={index === applicationStatus.completedStages.length - 1 && applicationStatus.pendingStages.length === 0}
                  />
                ))}
                
                {applicationStatus.pendingStages.map((stage, index) => (
                  <StatusStep
                    key={index}
                    step={stage}
                    isCompleted={false}
                    isCurrent={index === 0}
                    isLast={index === applicationStatus.pendingStages.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Agent Notes */}
            {applicationStatus.agentNotes && applicationStatus.agentNotes.length > 0 && (
              <div className="bg-white border rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Review Notes</span>
                </h4>
                
                <div className="space-y-4">
                  {applicationStatus.agentNotes.map((note, index) => (
                    <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-blue-800">{note.agent}</p>
                        <p className="text-sm text-blue-600">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-blue-700">{note.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-standard-green to-green-600 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>What's Next?</span>
              </h4>
              <p className="text-green-100">
                {applicationStatus.status === 'approved' 
                  ? 'Congratulations! Your application has been approved. Our team will contact you shortly to finalize the loan agreement.'
                  : applicationStatus.status === 'pending_documents'
                  ? 'We need additional documentation to proceed. Please check your email for specific requirements.'
                  : applicationStatus.status === 'rejected'
                  ? 'Your application was not approved at this time. You can reapply after addressing the feedback provided.'
                  : 'Your application is being reviewed by our ESG specialists. We will update you as soon as there are any developments.'
                }
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Need Help?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Customer Service</p>
                  <p className="font-semibold text-standard-blue">0860 123 000</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">ESG Specialist Team</p>
                  <p className="font-semibold text-standard-blue">greencred@standardbank.co.za</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}