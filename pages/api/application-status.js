import { getApplicationStatus, simulateAgentReview } from '../../utils/workflow.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { applicationId, referenceNumber } = req.query;

    if (!applicationId && !referenceNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'Application ID or reference number is required' 
      });
    }

    // Use applicationId if provided, otherwise extract from reference number
    const appId = applicationId || referenceNumber?.replace('GCLOAN-', '').toLowerCase();
    
    const status = await getApplicationStatus(appId);

    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application status',
      error: error.message
    });
  }
}