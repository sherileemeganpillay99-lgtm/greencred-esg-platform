import { calculateESGScore, calculateLoanTerms, getESGRecommendations } from '../../utils/esgCalculator';

// Generate ESG insights function moved here to avoid import issues
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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { esgData, loanAmount, companyName } = req.body;

  // Validate input
  if (!esgData || !loanAmount) {
    return res.status(400).json({ message: 'ESG data and loan amount are required' });
  }

  const requiredFields = ['environmental', 'social', 'governance', 'risk'];
  for (const field of requiredFields) {
    if (esgData[field] === undefined || esgData[field] === null || esgData[field] === '') {
      return res.status(400).json({ message: `${field} score is required` });
    }
    
    const score = parseFloat(esgData[field]);
    if (isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({ message: `${field} score must be between 0 and 100` });
    }
  }

  try {
    // Calculate ESG score
    const esgScore = calculateESGScore(esgData);
    
    // Calculate loan terms
    const loanTerms = calculateLoanTerms(loanAmount, esgScore);
    
    // Generate insights
    const insights = generateESGInsights(esgScore.breakdown);
    
    // Get recommendations
    const recommendations = getESGRecommendations(esgScore);

    const response = {
      success: true,
      companyName: companyName || 'Unknown Company',
      esgScore,
      loanTerms,
      insights,
      recommendations,
      timestamp: new Date().toISOString(),
      calculationDetails: {
        methodology: 'Equal weighting (25% each category)',
        riskAssessment: esgScore.rating,
        eligibleDiscount: `${esgScore.discount}%`,
        scoreBreakdown: {
          environmental: esgData.environmental,
          social: esgData.social,
          governance: esgData.governance,
          risk: esgData.risk,
          overall: esgScore.overallScore
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Score calculation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate ESG score',
      error: error.message 
    });
  }
}