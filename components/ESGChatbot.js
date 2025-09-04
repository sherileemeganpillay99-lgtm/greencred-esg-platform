import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  X,
  Sparkles,
  HelpCircle,
  Leaf,
  TrendingUp
} from 'lucide-react';

export default function ESGChatbot({ esgScores, companyName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hi! I'm your ESG assistant. I can help you with sustainable finance questions, ESG best practices, and advice on improving your sustainability scores. How can I help you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (message = inputMessage.trim()) => {
    if (!message) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          esgScores,
          companyName
        })
      });

      const result = await response.json();

      if (result.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: result.data.response,
          timestamp: result.data.timestamp,
          fallback: result.data.fallback
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How can I improve my ESG score?",
    "What is sustainable finance?",
    "How does ESG affect my loan rate?",
    "What are the best environmental practices?",
    "How to measure social impact?"
  ];

  const sendQuickQuestion = (question) => {
    sendMessage(question);
  };

  const requestPersonalizedAdvice = async () => {
    if (!esgScores) {
      sendMessage("I'd like personalized ESG advice, but I need my ESG scores first. Could you help me understand how to improve my sustainability practices?");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Please provide personalized ESG improvement advice',
          type: 'esg-advice',
          esgScores,
          companyName
        })
      });

      const result = await response.json();

      if (result.success) {
        const adviceMessage = {
          id: Date.now(),
          type: 'bot',
          content: result.data.response,
          timestamp: result.data.timestamp,
          personalized: true
        };
        setMessages(prev => [...prev, adviceMessage]);
      }
    } catch (error) {
      console.error('Personalized advice error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-standard-green to-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <div className="absolute -top-12 right-0 bg-black text-white text-sm px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
          Ask me about ESG & Sustainability
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-standard-green to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-standard-green" />
          </div>
          <div>
            <h3 className="font-semibold">ESG Assistant</h3>
            {!isMinimized && (
              <p className="text-xs text-green-100">Powered by AWS Bedrock</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-green-100 transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-standard-blue' 
                      : message.error 
                        ? 'bg-red-500' 
                        : message.personalized 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                          : 'bg-standard-green'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : message.personalized ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-standard-blue text-white'
                      : message.error
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : message.personalized
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 border border-purple-200'
                          : 'bg-gray-50 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.fallback && (
                      <p className="text-xs mt-2 opacity-75">
                        (Fallback response - AWS Bedrock unavailable)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-standard-green flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Quick questions:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickQuestion(question)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                
                {esgScores && (
                  <button
                    onClick={requestPersonalizedAdvice}
                    className="w-full text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Get Personalized ESG Advice</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about ESG or sustainability..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-standard-green focus:border-transparent"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-3 flex items-center space-x-1">
                  <Leaf className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-standard-green hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}