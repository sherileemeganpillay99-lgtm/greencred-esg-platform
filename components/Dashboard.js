import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const STANDARD_COLORS = {
  blue: '#003A70',
  lightBlue: '#0066CC',
  green: '#00A651',
  yellow: '#FFB81C',
  red: '#E31837',
  gray: '#666666'
};

export const ESGScoreChart = ({ data }) => {
  const chartData = [
    { name: 'Environmental', score: data.environmental, color: STANDARD_COLORS.green },
    { name: 'Social', score: data.social, color: STANDARD_COLORS.lightBlue },
    { name: 'Governance', score: data.governance, color: '#8b5cf6' },
    { name: 'Risk Mgmt', score: data.risk, color: '#f59e0b' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">ESG Score Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill={STANDARD_COLORS.blue} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ESGRadarChart = ({ data }) => {
  const radarData = [
    { subject: 'Environmental', score: data.environmental, fullMark: 100 },
    { subject: 'Social', score: data.social, fullMark: 100 },
    { subject: 'Governance', score: data.governance, fullMark: 100 },
    { subject: 'Risk', score: data.risk, fullMark: 100 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">ESG Performance Radar</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={45} domain={[0, 100]} />
          <Radar
            name="ESG Score"
            dataKey="score"
            stroke={STANDARD_COLORS.green}
            fill={STANDARD_COLORS.green}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RatingDistributionChart = ({ currentRating }) => {
  const distributionData = [
    { rating: 'A+', percentage: 5, color: '#059669' },
    { rating: 'A', percentage: 15, color: '#16a34a' },
    { rating: 'B+', percentage: 25, color: '#65a30d' },
    { rating: 'B', percentage: 30, color: '#ca8a04' },
    { rating: 'C', percentage: 20, color: '#ea580c' },
    { rating: 'D', percentage: 5, color: '#dc2626' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">Industry Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ rating, percentage }) => `${rating} (${percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="percentage"
          >
            {distributionData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.rating === currentRating ? '#000' : 'none'}
                strokeWidth={entry.rating === currentRating ? 3 : 0}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-sm text-gray-600 mt-2">
        Your rating: <span className="font-semibold text-standard-blue">{currentRating}</span>
      </p>
    </div>
  );
};

export const SavingsProjectionChart = ({ monthlyPayment, monthlySavings, termYears }) => {
  const months = termYears * 12;
  const projectionData = [];
  
  for (let i = 0; i <= months; i += 6) {
    const cumulativeSavings = (monthlySavings * i);
    const standardCost = ((monthlyPayment + monthlySavings) * i);
    const greenCredCost = (monthlyPayment * i);
    
    projectionData.push({
      month: i,
      standardCost: Math.round(standardCost),
      greenCredCost: Math.round(greenCredCost),
      cumulativeSavings: Math.round(cumulativeSavings)
    });
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">Savings Projection Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={projectionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Amount (R)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => [`R${value.toLocaleString()}`, '']} />
          <Area
            type="monotone"
            dataKey="cumulativeSavings"
            stackId="1"
            stroke={STANDARD_COLORS.green}
            fill={STANDARD_COLORS.green}
            fillOpacity={0.7}
            name="Cumulative Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ComparisonChart = ({ results }) => {
  const comparisonData = [
    {
      metric: 'Interest Rate',
      standard: results.baseRate,
      greenCred: results.discountedRate,
      unit: '%'
    },
    {
      metric: 'Monthly Payment',
      standard: results.monthlyPayment + results.monthlySavings,
      greenCred: results.monthlyPayment,
      unit: 'R'
    },
    {
      metric: 'Total Cost',
      standard: (results.monthlyPayment + results.monthlySavings) * results.termYears * 12,
      greenCred: results.monthlyPayment * results.termYears * 12,
      unit: 'R'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">Standard vs GreenCred Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              `${comparisonData[0].unit === '%' ? '' : 'R'}${value.toLocaleString()}${comparisonData[0].unit === '%' ? '%' : ''}`, 
              name
            ]} 
          />
          <Bar dataKey="standard" fill="#dc2626" name="Standard Rate" />
          <Bar dataKey="greenCred" fill={STANDARD_COLORS.green} name="GreenCred Rate" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ESGTrendChart = () => {
  const trendData = [
    { month: 'Jan', environmental: 65, social: 70, governance: 75, risk: 68 },
    { month: 'Feb', environmental: 68, social: 72, governance: 76, risk: 70 },
    { month: 'Mar', environmental: 70, social: 74, governance: 78, risk: 72 },
    { month: 'Apr', environmental: 73, social: 76, governance: 80, risk: 74 },
    { month: 'May', environmental: 75, social: 78, governance: 82, risk: 76 },
    { month: 'Jun', environmental: 78, social: 80, governance: 84, risk: 78 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-standard-blue mb-4">ESG Score Improvement Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[60, 90]} />
          <Tooltip />
          <Line type="monotone" dataKey="environmental" stroke={STANDARD_COLORS.green} strokeWidth={3} />
          <Line type="monotone" dataKey="social" stroke={STANDARD_COLORS.lightBlue} strokeWidth={3} />
          <Line type="monotone" dataKey="governance" stroke="#8b5cf6" strokeWidth={3} />
          <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-standard-green rounded-full mr-2"></div>
          <span>Environmental</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-standard-light-blue rounded-full mr-2"></div>
          <span>Social</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span>Governance</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span>Risk</span>
        </div>
      </div>
    </div>
  );
};