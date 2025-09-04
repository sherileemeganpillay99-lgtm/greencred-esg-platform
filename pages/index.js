import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { 
  Upload, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Users, 
  Leaf, 
  AlertCircle,
  FileText,
  Search,
  Award,
  DollarSign,
  PieChart,
  BarChart3,
  CheckCircle,
  MessageCircle,
  Clock
} from 'lucide-react';
import { calculateESGScore, calculateLoanTerms, getESGRecommendations } from '../utils/esgCalculator';
import { callCalculateScore } from '../lib/api-config';
// Local generateESGInsights function to avoid import issues
const generateESGInsights = (scores) => {
  const insights = [];
  
  // Environmental insights
  if (scores.environmental >= 80) {
    insights.push({
      category: 'Environmental',
      type: 'positive',
      message: 'Strong environmental performance with sustainable practices'
    });
  } else if (scores.environmental < 60) {
    insights.push({
      category: 'Environmental',
      type: 'warning',
      message: 'Environmental performance needs improvement'
    });
  }
  
  // Social insights
  if (scores.social >= 80) {
    insights.push({
      category: 'Social',
      type: 'positive',
      message: 'Excellent social responsibility and community engagement'
    });
  } else if (scores.social < 60) {
    insights.push({
      category: 'Social',
      type: 'warning',
      message: 'Social impact initiatives could be strengthened'
    });
  }
  
  // Governance insights
  if (scores.governance >= 80) {
    insights.push({
      category: 'Governance',
      type: 'positive',
      message: 'Strong governance structure and transparency'
    });
  } else if (scores.governance < 60) {
    insights.push({
      category: 'Governance',
      type: 'warning',
      message: 'Governance practices require enhancement'
    });
  }
  
  // Risk insights
  if (scores.risk >= 80) {
    insights.push({
      category: 'Risk',
      type: 'positive',
      message: 'Excellent risk management and mitigation strategies'
    });
  } else if (scores.risk < 60) {
    insights.push({
      category: 'Risk',
      type: 'warning',
      message: 'Risk management capabilities need strengthening'
    });
  }
  
  return insights;
};
import AIInsights from '../components/AIInsights';
import RealTimeESG from '../components/RealTimeESG';
import LoanApplication from '../components/LoanApplication';
import DocumentUpload from '../components/DocumentUpload';
import ESGChatbot from '../components/ESGChatbot';
import ApplicationStatus from '../components/ApplicationStatus';

export default function Home() {
  const [activeTab, setActiveTab] = useState('application');
  const [loanAmount, setLoanAmount] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [esgData, setEsgData] = useState({
    environmental: '',
    social: '',
    governance: '',
    risk: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scraperActive, setScraperActive] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [extractedESGData, setExtractedESGData] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const handleAutoFetchESG = async () => {
    if (!companyName.trim()) {
      alert('Please enter a company name first');
      return;
    }
    
    setScraperActive(true);
    setLoading(true);
    
    try {
      const response = await fetch('/api/scrape-esg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        const scrapedData = result.data;
        setEsgData({
          environmental: scrapedData.environmental.toString(),
          social: scrapedData.social.toString(),
          governance: scrapedData.governance.toString(),
          risk: scrapedData.risk.toString()
        });
      } else {
        throw new Error(result.message || 'Failed to fetch ESG data');
      }
    } catch (error) {
      console.error('Failed to fetch ESG data:', error);
      alert('Failed to fetch ESG data. Please try again or enter data manually.');
    } finally {
      setScraperActive(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanAmount || Object.values(esgData).some(val => !val)) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Call the live AWS API
      console.log('Using live AWS backend API...');
      const response = await callCalculateScore(esgData, loanAmount, companyName);
      
      // The AWS API returns data in a slightly different format, so let's adapt it
      const insights = generateESGInsights(response.data.breakdown);
      const recommendations = getESGRecommendations(response.data);
      
      setResults({
        overallScore: response.data.overallScore,
        rating: response.data.rating,
        color: response.data.color,
        breakdown: response.data.breakdown,
        loanAmount: response.data.loanTerms.loanAmount,
        baseRate: response.data.loanTerms.baseRate,
        discountedRate: response.data.loanTerms.discountedRate,
        discount: response.data.loanTerms.discount,
        monthlyPayment: response.data.loanTerms.monthlyPayment,
        monthlySavings: response.data.loanTerms.monthlySavings,
        totalSavings: response.data.loanTerms.totalSavings,
        insights,
        recommendations,
        companyName
      });
      
      setActiveTab('results');
    } catch (error) {
      console.error('AWS API Calculation error:', error);
      alert('Error calculating ESG score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // In production, you'd parse the file and extract ESG data
      console.log('File uploaded:', file.name);
    }
  };

  const handleInputChange = (field, value) => {
    setEsgData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleESGDataExtracted = (extractedData) => {
    setExtractedESGData(extractedData);
    // Auto-populate the ESG data fields if data was extracted
    Object.keys(extractedData).forEach(key => {
      if (extractedData[key] !== null && extractedData[key] !== undefined) {
        setEsgData(prev => ({
          ...prev,
          [key]: extractedData[key].toString()
        }));
      }
    });
  };

  const submitLoanApplication = async (applicationData) => {
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          esgScores: results?.breakdown || esgData,
          companyName,
          loanAmount: results?.loanAmount || loanAmount,
          extractedESGData,
          overallScore: results?.overallScore
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setApplicationSubmitted(true);
        setReferenceNumber(result.data.referenceNumber);
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      throw error;
    }
  };

  const ScoreCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 hover:shadow-xl transition-shadow duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center space-x-1 md:space-x-2 px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base ${
        activeTab === id 
          ? 'bg-standard-blue text-white shadow-md' 
          : 'text-standard-blue hover:bg-standard-blue hover:bg-opacity-10'
      }`}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Head>
        <title>GreenCred - ESG-Based Credit Scoring | Standard Bank</title>
        <meta name="description" content="Advanced ESG-based credit scoring for sustainable SME financing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-standard-blue">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-standard-blue rounded-full flex items-center justify-center">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-standard-blue">GreenCred</h1>
                <p className="text-sm text-standard-gray">Powered by Standard Bank</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-standard-blue">ESG-Based Credit Scoring</p>
                <p className="text-xs text-standard-gray">For Sustainable SME Financing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 justify-center">
          <TabButton id="application" label="Application" icon={FileText} />
          <TabButton id="results" label="Results" icon={BarChart3} />
          <TabButton id="insights" label="AI Insights" icon={Award} />
          <TabButton id="monitoring" label="Live ESG" icon={TrendingUp} />
          <TabButton id="status" label="Track Status" icon={Clock} />
        </div>

        {/* Application Tab */}
        {activeTab === 'application' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-standard-blue">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-standard-blue mb-2">SME Loan Application</h2>
                <p className="text-standard-gray">Submit your ESG data for sustainable financing rates</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-standard-blue mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input-field"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-standard-blue mb-2">
                      Loan Amount (R)
                    </label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="input-field"
                      placeholder="Enter loan amount"
                      min="50000"
                      step="10000"
                      required
                    />
                  </div>
                </div>

                {/* Auto-fetch ESG Data */}
                <div className="bg-gradient-to-r from-standard-green to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">AI-Powered ESG Data Extraction</h3>
                      <p className="text-green-100">Automatically fetch ESG data from public sources</p>
                    </div>
                    <Search className="w-12 h-12 text-green-200" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFetchESG}
                    disabled={scraperActive || !companyName.trim()}
                    className="bg-white text-standard-green font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scraperActive ? 'Fetching ESG Data...' : 'Auto-Fetch ESG Data'}
                  </button>
                </div>

                {/* Smart Document Upload with Textract */}
                <DocumentUpload 
                  onESGDataExtracted={handleESGDataExtracted}
                  companyName={companyName}
                />

                {/* Legacy File Upload (kept for compatibility) */}
                <div>
                  <label className="block text-sm font-semibold text-standard-blue mb-2">
                    Additional Documentation (Optional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Upload additional files</span>
                        </p>
                        {uploadedFile && (
                          <p className="text-sm text-standard-green mt-1 font-semibold">✓ {uploadedFile.name}</p>
                        )}
                      </div>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv,.xlsx,.pdf" />
                    </label>
                  </div>
                </div>

                {/* ESG Scores Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-standard-blue mb-2">
                      <Leaf className="inline w-5 h-5 mr-2 text-standard-green" />
                      Environmental Score (0-100)
                    </label>
                    <input
                      type="number"
                      value={esgData.environmental}
                      onChange={(e) => handleInputChange('environmental', e.target.value)}
                      className="input-field focus:ring-standard-green"
                      placeholder="Environmental performance"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-xs text-standard-gray">Carbon footprint, renewable energy, waste management</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-standard-blue mb-2">
                      <Users className="inline w-5 h-5 mr-2 text-blue-600" />
                      Social Score (0-100)
                    </label>
                    <input
                      type="number"
                      value={esgData.social}
                      onChange={(e) => handleInputChange('social', e.target.value)}
                      className="input-field focus:ring-blue-500"
                      placeholder="Social responsibility"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-xs text-standard-gray">Employee welfare, community impact, diversity</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-standard-blue mb-2">
                      <Shield className="inline w-5 h-5 mr-2 text-purple-600" />
                      Governance Score (0-100)
                    </label>
                    <input
                      type="number"
                      value={esgData.governance}
                      onChange={(e) => handleInputChange('governance', e.target.value)}
                      className="input-field focus:ring-purple-500"
                      placeholder="Corporate governance"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-xs text-standard-gray">Board structure, transparency, ethics</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-standard-blue mb-2">
                      <AlertCircle className="inline w-5 h-5 mr-2 text-orange-600" />
                      Risk Management Score (0-100)
                    </label>
                    <input
                      type="number"
                      value={esgData.risk}
                      onChange={(e) => handleInputChange('risk', e.target.value)}
                      className="input-field focus:ring-orange-500"
                      placeholder="Risk assessment"
                      min="0"
                      max="100"
                      required
                    />
                    <p className="text-xs text-standard-gray">Risk mitigation, compliance, resilience</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-6 h-6" />
                      <span>Calculate GreenCred Score</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && results && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Overall Score Display */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-standard-green">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6" style={{ backgroundColor: results.color + '20' }}>
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: results.color }}>
                  <span className="text-3xl font-bold text-white">{results.rating}</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-standard-blue mb-2">GreenCred Score: {results.overallScore}</h2>
              <p className="text-xl text-standard-gray mb-4">{results.companyName}</p>
              <p className="text-lg text-standard-gray">ESG-Based Credit Rating</p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScoreCard 
                icon={Leaf} 
                title="Environmental" 
                value={results.breakdown.environmental} 
                color="#00A651"
                subtitle="Carbon & Sustainability"
              />
              <ScoreCard 
                icon={Users} 
                title="Social" 
                value={results.breakdown.social} 
                color="#0066CC"
                subtitle="Community Impact"
              />
              <ScoreCard 
                icon={Shield} 
                title="Governance" 
                value={results.breakdown.governance} 
                color="#8b5cf6"
                subtitle="Corporate Ethics"
              />
              <ScoreCard 
                icon={AlertCircle} 
                title="Risk Management" 
                value={results.breakdown.risk} 
                color="#f59e0b"
                subtitle="Mitigation Strategies"
              />
            </div>

            {/* Loan Terms */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-standard-blue">
              <h3 className="text-2xl font-bold text-standard-blue mb-6 text-center">Your Sustainable Financing Terms</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h4 className="font-semibold text-gray-800 text-lg">Standard Rate</h4>
                  <p className="text-3xl font-bold text-red-500">{results.baseRate}%</p>
                  <p className="text-sm text-gray-600 mt-2">Market Prime Rate</p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-standard-green" />
                  <h4 className="font-semibold text-gray-800 text-lg">Your Rate</h4>
                  <p className="text-3xl font-bold text-standard-green">{results.discountedRate}%</p>
                  <p className="text-sm text-green-600 mt-2 font-semibold">{results.discount}% ESG Discount</p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-standard-light-blue" />
                  <h4 className="font-semibold text-gray-800 text-lg">Monthly Payment</h4>
                  <p className="text-3xl font-bold text-standard-light-blue">R{results.monthlyPayment.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-2">5-year term</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-standard-green to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">🎉 Congratulations!</h4>
                    <p className="text-green-100 text-lg">
                      Your ESG score of {results.overallScore} qualifies you for a {results.discount}% interest rate discount.
                    </p>
                    <p className="text-green-100 mt-2">
                      <span className="font-semibold">Monthly Savings: R{results.monthlySavings.toLocaleString()}</span>
                      {' • '}
                      <span className="font-semibold">Total Savings: R{results.totalSavings.toLocaleString()}</span>
                    </p>
                  </div>
                  <Award className="w-16 h-16 text-green-200" />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-standard-blue to-standard-light-blue rounded-2xl shadow-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply for Your Sustainable Loan?</h3>
              <p className="text-blue-100 mb-6 text-lg">
                Take advantage of your {results.discount}% ESG discount and join the sustainable finance revolution.
              </p>
              <button 
                onClick={() => setShowLoanApplication(true)}
                className="bg-white text-standard-blue font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200 text-lg"
              >
                Apply Now with Standard Bank
              </button>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && results && (
          <div className="max-w-6xl mx-auto space-y-8">
            <AIInsights esgData={esgData} results={results} />
          </div>
        )}

        {/* Real-Time Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="max-w-6xl mx-auto">
            <RealTimeESG companyName={companyName} />
          </div>
        )}

        {/* Application Status Tab */}
        {activeTab === 'status' && (
          <div className="max-w-6xl mx-auto">
            <ApplicationStatus />
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-standard-green">
            <h3 className="text-2xl font-bold text-center mb-8 text-standard-blue">How GreenCred Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-standard-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">AI-Powered Analysis</h4>
                <p className="text-gray-600">
                  Our system scrapes and analyzes ESG data from multiple sources to provide comprehensive scoring.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-standard-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">Equal Weighting Algorithm</h4>
                <p className="text-gray-600">
                  Environmental, Social, Governance, and Risk factors are equally weighted (25% each) for fair assessment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-standard-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">Dynamic Rate Discounts</h4>
                <p className="text-gray-600">
                  Higher ESG scores unlock better rates: up to 3% discount for A+ rated companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Application Modal */}
      <LoanApplication 
        isOpen={showLoanApplication}
        onClose={() => setShowLoanApplication(false)}
        results={results}
        onSubmit={submitLoanApplication}
      />

      {/* ESG Chatbot */}
      <ESGChatbot 
        esgScores={results?.breakdown || (esgData.environmental ? esgData : null)}
        companyName={companyName}
      />

      {/* Success Modal */}
      {applicationSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-standard-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-standard-blue mb-4">Application Submitted Successfully!</h2>
            
            <p className="text-gray-600 mb-6">
              Your loan application has been submitted and sent to our ESG specialists for review.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Reference Number:</h3>
              <p className="text-xl font-bold text-blue-600">{referenceNumber}</p>
              <p className="text-sm text-blue-600 mt-2">Please save this number to track your application</p>
            </div>
            
            <button
              onClick={() => {
                setApplicationSubmitted(false);
                setActiveTab('status');
              }}
              className="w-full bg-standard-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-standard-light-blue transition duration-200 mb-3"
            >
              Track Application Status
            </button>
            
            <button
              onClick={() => setApplicationSubmitted(false)}
              className="w-full text-standard-blue font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}