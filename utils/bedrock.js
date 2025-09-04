import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient, AWS_CONFIG } from '../lib/aws-config.js';

const ESG_CONTEXT = `
You are an ESG (Environmental, Social, and Governance) and sustainable finance expert assistant for GreenCred, 
a lending platform that provides ESG-based credit scoring for SMEs. Your role is to help users understand:

1. ESG principles and best practices
2. Sustainable finance concepts
3. How to improve ESG scores
4. GreenCred platform features
5. Environmental sustainability in business
6. Social responsibility practices
7. Corporate governance standards
8. Risk management for sustainability

Always provide accurate, helpful, and actionable advice. Keep responses concise but informative.
Focus on practical guidance that can help SMEs improve their ESG performance.
`;

export const chatWithBedrock = async (userMessage, conversationHistory = []) => {
  try {
    // Prepare the conversation context
    const messages = [
      { role: 'user', content: ESG_CONTEXT },
      { role: 'assistant', content: 'I understand. I am here to help with ESG and sustainable finance questions for GreenCred users.' }
    ];
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push(msg);
    });
    
    // Add current user message
    messages.push({ role: 'user', content: userMessage });
    
    // Prepare the request body for Claude 3 Haiku
    const requestBody = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: messages.slice(-10), // Keep last 10 messages for context
      temperature: 0.7,
      top_p: 0.9
    };

    const command = new InvokeModelCommand({
      modelId: AWS_CONFIG.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    });

    const response = await bedrockClient.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    return {
      success: true,
      response: responseBody.content[0].text,
      usage: responseBody.usage || null
    };
  } catch (error) {
    console.error('Bedrock error:', error);
    
    // Fallback response for demo purposes
    return {
      success: false,
      response: generateFallbackResponse(userMessage),
      usage: null,
      fallback: true
    };
  }
};

const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('esg') || message.includes('environmental') || message.includes('social') || message.includes('governance')) {
    return `ESG stands for Environmental, Social, and Governance factors that measure a company's sustainability and ethical impact. 

**Environmental** factors include carbon emissions, renewable energy use, waste management, and resource efficiency.

**Social** factors cover employee welfare, diversity, community engagement, and supply chain ethics.

**Governance** factors involve board structure, transparency, anti-corruption measures, and shareholder rights.

Improving your ESG score can help you qualify for better loan rates on GreenCred. Would you like specific advice on any of these areas?`;
  }
  
  if (message.includes('sustainable finance') || message.includes('green loan')) {
    return `Sustainable finance refers to financial services that consider environmental, social, and governance (ESG) factors in investment and lending decisions.

**Benefits of sustainable finance:**
- Lower interest rates for environmentally responsible businesses
- Access to green funding sources
- Improved company reputation and customer loyalty
- Long-term business resilience

GreenCred offers ESG-based credit scoring that can provide up to 3% interest rate discounts for companies with strong sustainability practices.`;
  }
  
  if (message.includes('improve') && (message.includes('score') || message.includes('rating'))) {
    return `Here are key ways to improve your ESG score:

**Environmental:**
- Reduce carbon emissions through energy efficiency
- Invest in renewable energy sources
- Implement waste reduction and recycling programs
- Track and report environmental metrics

**Social:**
- Promote diversity and inclusion in hiring
- Ensure fair labor practices and employee wellbeing
- Engage with local communities through CSR initiatives
- Maintain ethical supply chain standards

**Governance:**
- Establish transparent reporting practices
- Implement strong anti-corruption policies
- Ensure board diversity and independence
- Regular stakeholder communications

Would you like more specific guidance on any of these areas?`;
  }
  
  return `I'm here to help with ESG and sustainable finance questions for GreenCred users. I can assist with:

- Understanding ESG principles
- Improving your sustainability score
- Sustainable finance concepts
- GreenCred platform features

What specific aspect of ESG or sustainable finance would you like to learn about?`;
};

export const getESGAdvice = async (esgScores) => {
  try {
    const prompt = `Based on these ESG scores, provide specific improvement recommendations:
    Environmental: ${esgScores.environmental}/100
    Social: ${esgScores.social}/100  
    Governance: ${esgScores.governance}/100
    Risk Management: ${esgScores.risk}/100
    
    Provide 3 specific, actionable recommendations for each category where the score is below 80.`;
    
    const response = await chatWithBedrock(prompt);
    return response;
  } catch (error) {
    console.error('ESG advice error:', error);
    return {
      success: false,
      response: 'Unable to generate personalized advice at this time. Please try again later.',
      fallback: true
    };
  }
};