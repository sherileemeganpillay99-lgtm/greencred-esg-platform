import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye, 
  Zap,
  FileCheck,
  Loader
} from 'lucide-react';

export default function DocumentUpload({ onESGDataExtracted, companyName }) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [previewText, setPreviewText] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or image file (JPG, PNG)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadedFile(file);

    try {
      // Convert file to base64
      const fileBase64 = await convertFileToBase64(file);
      
      setProcessing(true);
      
      // Send to API for processing
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileData: fileBase64,
          fileName: file.name,
          companyName: companyName || 'Unknown Company',
          fileType: file.type
        })
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);
        setPreviewText(result.data.extractedText);
        
        // Pass extracted ESG metrics to parent component
        if (onESGDataExtracted && result.data.esgMetrics) {
          onESGDataExtracted(result.data.esgMetrics);
        }
      } else {
        setError(result.message || 'Failed to process document');
      }
    } catch (error) {
      console.error('Document upload error:', error);
      setError('Failed to upload and process document. Please try again.');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setError(null);
    setPreviewText('');
  };

  const ESGMetricCard = ({ label, value, icon: Icon, color }) => (
    <div className={`bg-white rounded-lg p-4 border-l-4 shadow-sm`} style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: color }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{label}</h4>
            <p className="text-2xl font-bold" style={{ color }}>
              {value !== null ? value : 'Not found'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Smart Document Processing</h3>
            <p className="text-blue-100">Upload your ESG documents and let AWS Textract extract the data automatically</p>
          </div>
          <Zap className="w-12 h-12 text-blue-200" />
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4" />
            <span>PDF & Images Supported</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Extraction</span>
          </div>
        </div>
      </div>

      {!uploadedFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
          <div className="text-center">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <label className="cursor-pointer">
              <span className="text-standard-blue text-lg font-semibold hover:text-standard-light-blue">
                Click to upload ESG document
              </span>
              <span className="text-gray-500"> or drag and drop</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={uploading}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, JPG, PNG (max 10MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-standard-blue" />
              <div>
                <h4 className="font-semibold text-gray-800">{uploadedFile.name}</h4>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-gray-400 hover:text-gray-600"
              disabled={processing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {(uploading || processing) && (
            <div className="flex items-center justify-center space-x-3 py-8">
              <Loader className="w-8 h-8 animate-spin text-standard-blue" />
              <div className="text-center">
                <p className="text-standard-blue font-semibold">
                  {uploading ? 'Uploading document...' : 'Processing with AWS Textract...'}
                </p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            </div>
          )}

          {extractedData && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-green-800">Document processed successfully!</h4>
              </div>

              {/* Extracted ESG Metrics */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-4">Extracted ESG Scores</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ESGMetricCard
                    label="Environmental"
                    value={extractedData.esgMetrics.environmental}
                    icon={FileText}
                    color="#00A651"
                  />
                  <ESGMetricCard
                    label="Social"
                    value={extractedData.esgMetrics.social}
                    icon={FileText}
                    color="#0066CC"
                  />
                  <ESGMetricCard
                    label="Governance"
                    value={extractedData.esgMetrics.governance}
                    icon={FileText}
                    color="#8b5cf6"
                  />
                  <ESGMetricCard
                    label="Risk Management"
                    value={extractedData.esgMetrics.risk}
                    icon={FileText}
                    color="#f59e0b"
                  />
                </div>
              </div>

              {/* Document Preview */}
              {previewText && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-800">Document Preview</h5>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>First {previewText.length} characters</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {previewText}
                      {extractedData.textLength > previewText.length && (
                        <span className="text-gray-500">... and {extractedData.textLength - previewText.length} more characters</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">Document Storage Info</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>✓ Document uploaded to secure AWS S3 storage</p>
                  <p>✓ Text extracted using AWS Textract</p>
                  <p>✓ ESG metrics automatically identified</p>
                  <p className="text-xs text-blue-600 mt-2">
                    File URL: {extractedData.uploadInfo?.url || 'Processing...'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}