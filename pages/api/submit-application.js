import { createLoanApplication } from '../../utils/workflow.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const applicationData = req.body;

    // Validate required fields
    const requiredFields = ['companyName', 'loanAmount', 'esgScores', 'contactInfo'];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return res.status(400).json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        });
      }
    }

    // Create loan application and initiate workflow
    const result = await createLoanApplication(applicationData);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
}