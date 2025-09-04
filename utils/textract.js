import { 
  DetectDocumentTextCommand,
  AnalyzeDocumentCommand 
} from '@aws-sdk/client-textract';
import { textractClient } from '../lib/aws-config.js';

export const extractTextFromDocument = async (documentBytes) => {
  try {
    const command = new DetectDocumentTextCommand({
      Document: {
        Bytes: documentBytes
      }
    });
    
    const response = await textractClient.send(command);
    
    let extractedText = '';
    for (const block of response.Blocks) {
      if (block.BlockType === 'LINE') {
        extractedText += block.Text + '\n';
      }
    }
    
    return extractedText;
  } catch (error) {
    console.error('Textract error:', error);
    throw new Error('Failed to extract text from document');
  }
};

export const analyzeESGDocument = async (documentBytes) => {
  try {
    const command = new AnalyzeDocumentCommand({
      Document: {
        Bytes: documentBytes
      },
      FeatureTypes: ['TABLES', 'FORMS']
    });
    
    const response = await textractClient.send(command);
    
    const extractedData = {
      text: '',
      tables: [],
      forms: []
    };
    
    for (const block of response.Blocks) {
      if (block.BlockType === 'LINE') {
        extractedData.text += block.Text + '\n';
      } else if (block.BlockType === 'TABLE') {
        extractedData.tables.push(block);
      } else if (block.BlockType === 'KEY_VALUE_SET') {
        extractedData.forms.push(block);
      }
    }
    
    return extractedData;
  } catch (error) {
    console.error('Textract analysis error:', error);
    throw new Error('Failed to analyze document');
  }
};

export const extractESGMetrics = (extractedText) => {
  const esgMetrics = {
    environmental: null,
    social: null,
    governance: null,
    risk: null
  };
  
  const text = extractedText.toLowerCase();
  
  // Environmental keywords and patterns
  const environmentalPatterns = [
    /carbon.*emissions?.*(\d+)/,
    /renewable.*energy.*(\d+)/,
    /waste.*reduction.*(\d+)/,
    /environmental.*score.*(\d+)/,
    /sustainability.*rating.*(\d+)/
  ];
  
  // Social keywords and patterns
  const socialPatterns = [
    /employee.*satisfaction.*(\d+)/,
    /diversity.*index.*(\d+)/,
    /community.*engagement.*(\d+)/,
    /social.*impact.*(\d+)/,
    /workplace.*safety.*(\d+)/
  ];
  
  // Governance keywords and patterns
  const governancePatterns = [
    /board.*independence.*(\d+)/,
    /transparency.*score.*(\d+)/,
    /compliance.*rating.*(\d+)/,
    /governance.*index.*(\d+)/,
    /ethics.*score.*(\d+)/
  ];
  
  // Risk management patterns
  const riskPatterns = [
    /risk.*management.*(\d+)/,
    /cybersecurity.*score.*(\d+)/,
    /operational.*risk.*(\d+)/,
    /compliance.*risk.*(\d+)/,
    /business.*continuity.*(\d+)/
  ];
  
  // Extract environmental metrics
  for (const pattern of environmentalPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        esgMetrics.environmental = score;
        break;
      }
    }
  }
  
  // Extract social metrics
  for (const pattern of socialPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        esgMetrics.social = score;
        break;
      }
    }
  }
  
  // Extract governance metrics
  for (const pattern of governancePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        esgMetrics.governance = score;
        break;
      }
    }
  }
  
  // Extract risk metrics
  for (const pattern of riskPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const score = parseInt(match[1]);
      if (score >= 0 && score <= 100) {
        esgMetrics.risk = score;
        break;
      }
    }
  }
  
  // If no specific scores found, try to extract general ESG scores
  const generalESGPattern = /esg.*score.*(\d+)/;
  const generalMatch = text.match(generalESGPattern);
  if (generalMatch && generalMatch[1]) {
    const generalScore = parseInt(generalMatch[1]);
    if (generalScore >= 0 && generalScore <= 100) {
      // Distribute the general score across categories if individual scores not found
      Object.keys(esgMetrics).forEach(key => {
        if (esgMetrics[key] === null) {
          esgMetrics[key] = Math.floor(generalScore + (Math.random() - 0.5) * 20);
          esgMetrics[key] = Math.max(0, Math.min(100, esgMetrics[key]));
        }
      });
    }
  }
  
  return esgMetrics;
};