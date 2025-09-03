// API Configuration for GreenCred
// Switch between local development and production AWS APIs

const API_CONFIG = {
  // Use environment variable or default to production
  USE_AWS_BACKEND: process.env.NEXT_PUBLIC_USE_AWS_BACKEND === 'true' || true,
  
  // AWS Production API Base URL
  AWS_BASE_URL: 'https://6xzu4v9rs4.execute-api.us-east-1.amazonaws.com/prod',
  
  // Local development API base URL
  LOCAL_BASE_URL: '',
};

// Get the appropriate API URL based on configuration
export const getApiUrl = (endpoint) => {
  if (API_CONFIG.USE_AWS_BACKEND) {
    return `${API_CONFIG.AWS_BASE_URL}${endpoint}`;
  } else {
    return `${API_CONFIG.LOCAL_BASE_URL}${endpoint}`;
  }
};

// API endpoints
export const API_ENDPOINTS = {
  CALCULATE_SCORE: '/api/calculate-score',
  SUBMIT_APPLICATION: '/api/submit-application',
  SCRAPE_ESG: '/api/scrape-esg', // This will fallback to local for now
};

// API helper functions
export const callCalculateScore = async (esgData, loanAmount, companyName) => {
  try {
    const url = getApiUrl(API_ENDPOINTS.CALCULATE_SCORE);
    console.log('Calling Calculate Score API:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        esgData,
        loanAmount,
        companyName
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to calculate ESG score');
    }

    return data;
  } catch (error) {
    console.error('Calculate Score API Error:', error);
    throw error;
  }
};

export const callSubmitApplication = async (applicationData) => {
  try {
    const url = getApiUrl(API_ENDPOINTS.SUBMIT_APPLICATION);
    console.log('Calling Submit Application API:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to submit application');
    }

    return data;
  } catch (error) {
    console.error('Submit Application API Error:', error);
    throw error;
  }
};

export default API_CONFIG;