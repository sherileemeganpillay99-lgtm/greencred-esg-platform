// ESG scoring system with equal weighting (25% each)
export const calculateESGScore = (data) => {
  const env = parseFloat(data.environmental) || 0;
  const soc = parseFloat(data.social) || 0;
  const gov = parseFloat(data.governance) || 0;
  const risk = parseFloat(data.risk) || 0;

  // Equal weighting (25% each) as requested
  const overallScore = (env + soc + gov + risk) / 4;
  
  let rating = 'D';
  let discount = 0;
  let color = '#dc2626'; // red
  
  if (overallScore >= 90) {
    rating = 'A+';
    discount = 3.0;
    color = '#059669'; // green
  } else if (overallScore >= 80) {
    rating = 'A';
    discount = 2.5;
    color = '#16a34a'; // green
  } else if (overallScore >= 70) {
    rating = 'B+';
    discount = 2.0;
    color = '#65a30d'; // lime
  } else if (overallScore >= 60) {
    rating = 'B';
    discount = 1.5;
    color = '#ca8a04'; // yellow
  } else if (overallScore >= 50) {
    rating = 'C';
    discount = 1.0;
    color = '#ea580c'; // orange
  } else if (overallScore >= 40) {
    rating = 'D';
    discount = 0.5;
    color = '#dc2626'; // red
  }

  return {
    overallScore: Math.round(overallScore * 10) / 10,
    rating,
    discount,
    color,
    breakdown: {
      environmental: env,
      social: soc,
      governance: gov,
      risk: risk
    }
  };
};

export const calculateLoanTerms = (loanAmount, esgScore, basePrimeRate = 7.5) => {
  const amount = parseFloat(loanAmount) || 0;
  const discountedRate = Math.max(0.5, basePrimeRate - esgScore.discount);
  
  // Calculate monthly payment (assuming 5-year term)
  const termYears = 5;
  const monthlyRate = discountedRate / 100 / 12;
  const numPayments = termYears * 12;
  
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  // Calculate savings compared to base rate
  const baseMonthlyRate = basePrimeRate / 100 / 12;
  const baseMonthlyPayment = (amount * baseMonthlyRate * Math.pow(1 + baseMonthlyRate, numPayments)) / 
                            (Math.pow(1 + baseMonthlyRate, numPayments) - 1);
  
  const monthlySavings = baseMonthlyPayment - monthlyPayment;
  const totalSavings = monthlySavings * numPayments;
  
  return {
    loanAmount: amount,
    baseRate: basePrimeRate,
    discountedRate: Math.round(discountedRate * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    termYears
  };
};

export const getESGRecommendations = (scores) => {
  const recommendations = [];
  
  Object.entries(scores.breakdown).forEach(([category, score]) => {
    if (score < 70) {
      switch (category) {
        case 'environmental':
          recommendations.push({
            category: 'Environmental',
            priority: score < 50 ? 'High' : 'Medium',
            suggestion: 'Implement renewable energy sources and reduce carbon footprint',
            impact: 'Could improve score by 15-20 points',
            icon: '🌱'
          });
          break;
        case 'social':
          recommendations.push({
            category: 'Social',
            priority: score < 50 ? 'High' : 'Medium',
            suggestion: 'Enhance employee welfare and community engagement programs',
            impact: 'Could improve score by 10-15 points',
            icon: '👥'
          });
          break;
        case 'governance':
          recommendations.push({
            category: 'Governance',
            priority: score < 50 ? 'High' : 'Medium',
            suggestion: 'Strengthen board independence and transparency practices',
            impact: 'Could improve score by 12-18 points',
            icon: '🏛️'
          });
          break;
        case 'risk':
          recommendations.push({
            category: 'Risk Management',
            priority: score < 50 ? 'High' : 'Medium',
            suggestion: 'Develop comprehensive risk assessment and mitigation strategies',
            impact: 'Could improve score by 10-16 points',
            icon: '🛡️'
          });
          break;
      }
    }
  });
  
  return recommendations;
};