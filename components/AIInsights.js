import { useState, useEffect } from 'react';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Zap,
  Award
} from 'lucide-react';

export default function AIInsights({ esgData, results }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAIInsights();
  }, [esgData, results]);

  const generateAIInsights = async () => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiInsights = [
      {
        type: 'opportunity',
        category: 'Environmental',
        title: 'Carbon Credit Potential',
        description: 'Based on your environmental score, implementing renewable energy could generate R50,000+ annually in carbon credits.',
        confidence: 0.87,
        impact: 'High',
        icon: Lightbulb,
        action: 'Conduct renewable energy audit',
        timeframe: '3-6 months'
      },
      {
        type: 'risk',
        category: 'Governance',
        title: 'Regulatory Compliance Gap',
        description: 'AI analysis detected potential gaps in ESG reporting that may affect future compliance ratings.',
        confidence: 0.73,
        impact: 'Medium',
        icon: AlertTriangle,
        action: 'Update ESG reporting framework',
        timeframe: '1-2 months'
      },
      {
        type: 'achievement',
        category: 'Social',
        title: 'Industry Leadership',
        description: 'Your social impact score places you in the top 25% of SMEs in your sector.',
        confidence: 0.95,
        impact: 'High',
        icon: Award,
        action: 'Leverage for marketing and partnerships',
        timeframe: 'Immediate'
      },
      {
        type: 'optimization',
        category: 'Risk',
        title: 'Supply Chain Resilience',
        description: 'Diversifying suppliers could improve risk score by 8-12 points and reduce operational vulnerabilities.',
        confidence: 0.81,
        impact: 'Medium',
        icon: Target,
        action: 'Conduct supply chain assessment',
        timeframe: '2-4 months'
      }
    ];

    setInsights(aiInsights);
    setLoading(false);
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'opportunity':
        return 'border-green-500 bg-green-50';
      case 'risk':
        return 'border-red-500 bg-red-50';
      case 'achievement':
        return 'border-blue-500 bg-blue-50';
      case 'optimization':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getInsightIconColor = (type) => {
    switch (type) {
      case 'opportunity':
        return 'text-green-600';
      case 'risk':
        return 'text-red-600';
      case 'achievement':
        return 'text-blue-600';
      case 'optimization':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
        <div className="flex items-center justify-center mb-6">
          <Brain className="w-8 h-8 text-purple-600 mr-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-purple-600">AI is analyzing your data...</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-purple-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-purple-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
      <div className="flex items-center mb-6">
        <Brain className="w-8 h-8 text-purple-600 mr-3" />
        <div>
          <h3 className="text-2xl font-bold text-purple-600">AI-Powered Insights</h3>
          <p className="text-gray-600">Advanced analytics and recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-6 transition-all duration-300 hover:shadow-md ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-6 h-6 ${getInsightIconColor(insight.type)}`} />
                  <div>
                    <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                      {insight.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className="font-semibold">{Math.round(insight.confidence * 100)}%</div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {insight.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {insight.impact} Impact
                  </span>
                  <span className="text-gray-500">{insight.timeframe}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-purple-600">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="font-medium">Action: {insight.action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Score Prediction */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">
        <h4 className="text-xl font-semibold mb-3 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          AI Score Prediction
        </h4>
        <p className="text-purple-100 mb-4">
          By implementing these recommendations, your ESG score could improve by 12-18 points within 6 months, 
          potentially upgrading your rating to <span className="font-bold text-yellow-300">A-</span> and 
          increasing your interest rate discount to <span className="font-bold text-yellow-300">2.8%</span>.
        </p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-300">+15</div>
            <div className="text-sm text-purple-100">Potential Score Increase</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-300">R28,000</div>
            <div className="text-sm text-purple-100">Additional Annual Savings</div>
          </div>
        </div>
      </div>
    </div>
  );
}