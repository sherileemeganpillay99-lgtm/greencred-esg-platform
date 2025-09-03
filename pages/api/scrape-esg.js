// Mock ESG data sources for demo purposes
const mockESGData = {
  'apple': {
    environmental: 85,
    social: 78,
    governance: 92,
    risk: 75,
    source: 'Sustainability Report 2023'
  },
  'microsoft': {
    environmental: 88,
    social: 85,
    governance: 90,
    risk: 80,
    source: 'ESG Fact Sheet 2023'
  },
  'tesla': {
    environmental: 95,
    social: 70,
    governance: 65,
    risk: 72,
    source: 'Impact Report 2023'
  },
  'default': {
    environmental: Math.floor(Math.random() * 40) + 60,
    social: Math.floor(Math.random() * 40) + 60,
    governance: Math.floor(Math.random() * 40) + 60,
    risk: Math.floor(Math.random() * 40) + 60,
    source: 'Estimated ESG Metrics'
  }
};

const scrapeESGData = async (companyName) => {
  try {
    // Simulate web scraping delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cleanedName = companyName.toLowerCase().trim();
    
    // Return mock data for demo
    return mockESGData[cleanedName] || {
      ...mockESGData.default,
      source: `Generated ESG data for ${companyName}`
    };
    
  } catch (error) {
    console.error('Error scraping ESG data:', error);
    return mockESGData.default;
  }
};

const searchESGReports = async (companyName) => {
  try {
    // Simulate searching for ESG reports
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const reports = [
      {
        title: `${companyName} Sustainability Report 2023`,
        url: `https://example.com/${companyName.toLowerCase()}/sustainability-2023.pdf`,
        type: 'Sustainability Report',
        year: 2023,
        relevance: 0.95
      },
      {
        title: `${companyName} ESG Performance Data`,
        url: `https://example.com/${companyName.toLowerCase()}/esg-data.json`,
        type: 'ESG Data',
        year: 2023,
        relevance: 0.88
      },
      {
        title: `${companyName} Carbon Footprint Analysis`,
        url: `https://example.com/${companyName.toLowerCase()}/carbon-analysis.pdf`,
        type: 'Environmental Report',
        year: 2023,
        relevance: 0.82
      }
    ];
    
    return reports;
  } catch (error) {
    console.error('Error searching ESG reports:', error);
    return [];
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { companyName } = req.body;

  if (!companyName) {
    return res.status(400).json({ message: 'Company name is required' });
  }

  try {
    // Scrape ESG data
    const esgData = await scrapeESGData(companyName);
    
    // Search for ESG reports
    const reports = await searchESGReports(companyName);

    res.status(200).json({
      success: true,
      data: esgData,
      reports,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('ESG scraping error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to scrape ESG data',
      error: error.message 
    });
  }
}