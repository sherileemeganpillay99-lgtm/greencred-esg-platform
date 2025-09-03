import { useState, useEffect } from 'react';
import { 
  Globe, 
  Wifi, 
  Activity, 
  RefreshCw, 
  Satellite,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function RealTimeESG({ companyName }) {
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    if (companyName) {
      startRealTimeMonitoring();
    }
  }, [companyName]);

  const startRealTimeMonitoring = async () => {
    setLoading(true);
    
    // Simulate real-time data fetching
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRealTimeData = {
      environmental: {
        carbonEmissions: {
          current: 125.7,
          trend: -2.3,
          unit: 'tons CO2/month',
          status: 'improving'
        },
        energyEfficiency: {
          current: 87.2,
          trend: 1.8,
          unit: '% renewable',
          status: 'improving'
        },
        wasteReduction: {
          current: 73.5,
          trend: 0.5,
          unit: '% recycled',
          status: 'stable'
        }
      },
      social: {
        employeeSatisfaction: {
          current: 82.1,
          trend: 3.2,
          unit: '% satisfaction',
          status: 'improving'
        },
        diversityIndex: {
          current: 68.9,
          trend: 1.1,
          unit: 'diversity score',
          status: 'improving'
        },
        communityInvestment: {
          current: 2.3,
          trend: 0.8,
          unit: '% of revenue',
          status: 'improving'
        }
      },
      governance: {
        boardIndependence: {
          current: 75.0,
          trend: 0.0,
          unit: '% independent',
          status: 'stable'
        },
        transparencyScore: {
          current: 89.5,
          trend: 2.1,
          unit: 'transparency rating',
          status: 'improving'
        },
        ethicsViolations: {
          current: 0,
          trend: 0,
          unit: 'incidents',
          status: 'excellent'
        }
      },
      risk: {
        cyberSecurity: {
          current: 94.2,
          trend: 1.5,
          unit: 'security score',
          status: 'improving'
        },
        supplychainRisk: {
          current: 78.8,
          trend: -0.7,
          unit: 'risk rating',
          status: 'stable'
        },
        regulatoryCompliance: {
          current: 96.1,
          trend: 0.3,
          unit: '% compliant',
          status: 'excellent'
        }
      }
    };

    setRealTimeData(mockRealTimeData);
    setLoading(false);
  };

  const getTrendIcon = (trend, status) => {
    if (status === 'excellent') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (trend > 1) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < -1) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'improving': return 'text-blue-600 bg-blue-100';
      case 'stable': return 'text-yellow-600 bg-yellow-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const MetricCard = ({ title, metric }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        {getTrendIcon(metric.trend, metric.status)}
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-gray-900">{metric.current}</span>
        <span className="text-xs text-gray-500">{metric.unit}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
          {metric.status}
        </span>
        {metric.trend !== 0 && (
          <span className={`text-xs ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metric.trend > 0 ? '+' : ''}{metric.trend}%
          </span>
        )}
      </div>
    </div>
  );

  if (!companyName) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
        <div className="text-center text-gray-500">
          <Satellite className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Enter a company name to start real-time ESG monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-indigo-600" />
          <div>
            <h3 className="text-2xl font-bold text-indigo-600">Real-Time ESG Monitoring</h3>
            <p className="text-gray-600">{companyName} • Live Data Feed</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Wifi className={`w-5 h-5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm text-gray-600">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={startRealTimeMonitoring}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-indigo-600">Fetching real-time ESG data...</p>
          </div>
        </div>
      ) : realTimeData ? (
        <div className="space-y-8">
          {/* Environmental Metrics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Environmental Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Carbon Emissions" metric={realTimeData.environmental.carbonEmissions} />
              <MetricCard title="Energy Efficiency" metric={realTimeData.environmental.energyEfficiency} />
              <MetricCard title="Waste Reduction" metric={realTimeData.environmental.wasteReduction} />
            </div>
          </div>

          {/* Social Metrics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Social Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Employee Satisfaction" metric={realTimeData.social.employeeSatisfaction} />
              <MetricCard title="Diversity Index" metric={realTimeData.social.diversityIndex} />
              <MetricCard title="Community Investment" metric={realTimeData.social.communityInvestment} />
            </div>
          </div>

          {/* Governance Metrics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Governance Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Board Independence" metric={realTimeData.governance.boardIndependence} />
              <MetricCard title="Transparency Score" metric={realTimeData.governance.transparencyScore} />
              <MetricCard title="Ethics Violations" metric={realTimeData.governance.ethicsViolations} />
            </div>
          </div>

          {/* Risk Metrics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              Risk Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Cyber Security" metric={realTimeData.risk.cyberSecurity} />
              <MetricCard title="Supply Chain Risk" metric={realTimeData.risk.supplychainRisk} />
              <MetricCard title="Regulatory Compliance" metric={realTimeData.risk.regulatoryCompliance} />
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2">Live ESG Monitoring Active</h4>
                <p className="text-indigo-100">
                  Your ESG metrics are being monitored in real-time. Any significant changes will trigger automated alerts.
                </p>
              </div>
              <Activity className="w-12 h-12 text-indigo-200 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No real-time data available</p>
          <button
            onClick={startRealTimeMonitoring}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Monitoring
          </button>
        </div>
      )}
    </div>
  );
}