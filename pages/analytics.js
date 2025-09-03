import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity, 
  ArrowLeft,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import {
  ESGScoreChart,
  ESGRadarChart,
  RatingDistributionChart,
  SavingsProjectionChart,
  ComparisonChart,
  ESGTrendChart
} from '../components/Dashboard';
import LoanApplication from '../components/LoanApplication';

export default function Analytics() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoanApplication, setShowLoanApplication] = useState(false);

  useEffect(() => {
    // In a real app, this would come from props, context, or API call
    // For demo, we'll use sample data
    const sampleResults = {
      overallScore: 78.5,
      rating: 'B+',
      discount: 2.0,
      color: '#65a30d',
      breakdown: {
        environmental: 82,
        social: 75,
        governance: 80,
        risk: 77
      },
      loanAmount: 500000,
      baseRate: 7.5,
      discountedRate: 5.5,
      monthlyPayment: 9435,
      monthlySavings: 875,
      totalSavings: 52500,
      termYears: 5,
      companyName: 'Sample SME Company'
    };
    
    setResults(sampleResults);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-standard-blue mb-4"></div>
          <p className="text-standard-blue font-semibold">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-standard-blue text-xl mb-4">No data available for analytics</p>
          <Link href="/" className="btn-primary">
            Go to Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Head>
        <title>GreenCred Analytics Dashboard | Standard Bank</title>
        <meta name="description" content="Advanced ESG analytics and insights dashboard" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-standard-blue">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-standard-blue hover:text-standard-light-blue transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-standard-blue">Analytics Dashboard</h1>
                <p className="text-sm text-standard-gray">{results.companyName} • GreenCred Score: {results.overallScore}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-standard-blue hover:text-standard-light-blue transition-colors">
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Export</span>
              </button>
              <button className="flex items-center space-x-2 text-standard-blue hover:text-standard-light-blue transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button className="flex items-center space-x-2 text-standard-blue hover:text-standard-light-blue transition-colors">
                <RefreshCw className="w-5 h-5" />
                <span className="hidden md:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-standard-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">ESG Score</p>
                <p className="text-3xl font-bold text-standard-green">{results.overallScore}</p>
                <p className="text-sm text-green-600">Rating: {results.rating}</p>
              </div>
              <Activity className="w-12 h-12 text-standard-green opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-standard-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Interest Rate</p>
                <p className="text-3xl font-bold text-standard-blue">{results.discountedRate}%</p>
                <p className="text-sm text-blue-600">{results.discount}% discount</p>
              </div>
              <TrendingUp className="w-12 h-12 text-standard-blue opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Monthly Savings</p>
                <p className="text-3xl font-bold text-yellow-600">R{results.monthlySavings.toLocaleString()}</p>
                <p className="text-sm text-yellow-600">Per month</p>
              </div>
              <PieChart className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Savings</p>
                <p className="text-3xl font-bold text-purple-600">R{results.totalSavings.toLocaleString()}</p>
                <p className="text-sm text-purple-600">Over {results.termYears} years</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ESGScoreChart data={results.breakdown} />
          <ESGRadarChart data={results.breakdown} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RatingDistributionChart currentRating={results.rating} />
          <SavingsProjectionChart 
            monthlyPayment={results.monthlyPayment}
            monthlySavings={results.monthlySavings}
            termYears={results.termYears}
          />
        </div>

        {/* Full Width Charts */}
        <div className="space-y-8">
          <ComparisonChart results={results} />
          <ESGTrendChart />
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8 border-t-4 border-standard-blue">
          <h3 className="text-2xl font-bold text-standard-blue mb-6">Key Insights & Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Environmental Excellence</h4>
              <p className="text-green-700 text-sm">
                Your environmental score of {results.breakdown.environmental} is above average, qualifying for green finance incentives.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">👥 Social Impact</h4>
              <p className="text-blue-700 text-sm">
                Social score of {results.breakdown.social} shows strong community engagement and employee welfare programs.
              </p>
            </div>

            <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🏛️ Governance Structure</h4>
              <p className="text-purple-700 text-sm">
                Governance score of {results.breakdown.governance} indicates robust corporate governance and transparency.
              </p>
            </div>

            <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">🛡️ Risk Management</h4>
              <p className="text-orange-700 text-sm">
                Risk management score of {results.breakdown.risk} demonstrates strong risk mitigation capabilities.
              </p>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">💰 Financial Benefits</h4>
              <p className="text-yellow-700 text-sm">
                Your ESG performance saves R{results.monthlySavings.toLocaleString()} monthly through reduced interest rates.
              </p>
            </div>

            <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2">📈 Growth Potential</h4>
              <p className="text-indigo-700 text-sm">
                Strong ESG foundation positions your company for sustainable growth and investor confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-standard-blue to-standard-light-blue rounded-2xl shadow-xl p-8 mt-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Move Forward?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Your ESG analysis shows strong potential for sustainable financing benefits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowLoanApplication(true)}
              className="bg-white text-standard-blue font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Apply for Loan
            </button>
            <Link href="/" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-standard-blue transition duration-200 text-center">
              Update ESG Data
            </Link>
          </div>
        </div>
      </div>

      {/* Loan Application Modal */}
      <LoanApplication 
        isOpen={showLoanApplication}
        onClose={() => setShowLoanApplication(false)}
        results={results}
      />
    </div>
  );
}