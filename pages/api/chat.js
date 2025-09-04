import { chatWithBedrock, getESGAdvice } from '../../utils/bedrock.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory, type, esgScores } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    let response;
    
    if (type === 'esg-advice' && esgScores) {
      // Get personalized ESG advice based on scores
      response = await getESGAdvice(esgScores);
    } else {
      // Regular chat
      response = await chatWithBedrock(message, conversationHistory || []);
    }

    res.status(200).json({
      success: true,
      data: {
        response: response.response,
        timestamp: new Date().toISOString(),
        usage: response.usage,
        fallback: response.fallback || false
      }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      error: error.message
    });
  }
}