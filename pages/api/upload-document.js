import { extractTextFromDocument, extractESGMetrics } from '../../utils/textract.js';
import { uploadDocument } from '../../utils/s3.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileData, fileName, companyName, fileType } = req.body;

    if (!fileData || !fileName || !companyName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert base64 file data to buffer
    const fileBuffer = Buffer.from(fileData, 'base64');
    
    // Create file object for S3 upload
    const file = {
      buffer: fileBuffer,
      name: fileName,
      mimetype: fileType || 'application/pdf'
    };

    // Upload to S3
    const uploadResult = await uploadDocument(file, companyName, 'esg-document');

    // Extract text using Textract
    const extractedText = await extractTextFromDocument(fileBuffer);
    
    // Extract ESG metrics from the text
    const esgMetrics = extractESGMetrics(extractedText);

    return res.status(200).json({
      success: true,
      data: {
        uploadInfo: uploadResult,
        extractedText: extractedText.substring(0, 1000), // First 1000 chars for preview
        esgMetrics,
        textLength: extractedText.length
      },
      message: 'Document processed successfully'
    });
  } catch (error) {
    console.error('Document processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process document',
      error: error.message
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};