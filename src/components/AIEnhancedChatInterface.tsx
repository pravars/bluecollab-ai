import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import AIAssistant, { ConversationContext, JobDetails } from '../services/AIAssistant';

interface AIEnhancedChatInterfaceProps {
  onJobCreated?: (jobDetails: JobDetails) => void;
  onBack?: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isJobReady?: boolean;
  jobDetails?: JobDetails;
}

export default function AIEnhancedChatInterface({ onJobCreated, onBack }: AIEnhancedChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi! I'm your AI assistant for Dwello. I'm here to help you create the perfect job posting by asking the right questions and gathering all the details service providers need to give you accurate quotes. What kind of home service do you need?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>(
    AIAssistant.resetContext()
  );
  const [showJobPreview, setShowJobPreview] = useState(false);
  const [pendingJobDetails, setPendingJobDetails] = useState<JobDetails | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await AIAssistant.generateResponse(inputValue, conversationContext);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        isJobReady: response.isJobReady,
        jobDetails: response.jobDetails
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationContext(response.updatedContext);

      // If job is ready, show preview
      if (response.isJobReady && response.jobDetails) {
        setPendingJobDetails(response.jobDetails);
        setShowJobPreview(true);
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateJob = () => {
    if (pendingJobDetails && onJobCreated) {
      onJobCreated(pendingJobDetails);
      setShowJobPreview(false);
      setPendingJobDetails(null);
      
      // Reset conversation
      setConversationContext(AIAssistant.resetContext());
      setMessages([{
        id: Date.now(),
        text: "✅ Great! I've created your job posting. It's now live and service providers can start bidding. Is there anything else I can help you with?",
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };

  const handleStartNewConversation = () => {
    setConversationContext(AIAssistant.resetContext());
    setMessages([{
      id: 1,
      text: "👋 Hi! I'm your AI assistant for Dwello. I'm here to help you create the perfect job posting by asking the right questions and gathering all the details service providers need to give you accurate quotes. What kind of home service do you need?",
      sender: 'ai',
      timestamp: new Date()
    }]);
    setShowJobPreview(false);
    setPendingJobDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-5 h-5 rotate-180 text-gray-600" />
                </button>
              )}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
                <p className="text-sm text-gray-600">Let me help you create the perfect job posting</p>
              </div>
            </div>
            <button
              onClick={handleStartNewConversation}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              New Conversation
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      {message.isJobReady && message.jobDetails && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-1 text-green-700 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>Ready to create job posting</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
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

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you need help with..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Preview Modal */}
      {showJobPreview && pendingJobDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span>Job Posting Preview</span>
                </h3>
                <button
                  onClick={() => setShowJobPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Title</h4>
                  <p className="text-gray-600">{pendingJobDetails.title}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700">Description</h4>
                  <p className="text-gray-600">{pendingJobDetails.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Service Type</h4>
                    <p className="text-gray-600">{pendingJobDetails.serviceType}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Timeline</h4>
                    <p className="text-gray-600">{pendingJobDetails.timeline}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Budget</h4>
                    <p className="text-gray-600">{pendingJobDetails.budget}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">Urgency</h4>
                    <p className="text-gray-600 capitalize">{pendingJobDetails.urgency}</p>
                  </div>
                </div>
                
                {pendingJobDetails.specialRequirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Special Requirements</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {pendingJobDetails.specialRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowJobPreview(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleCreateJob}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors"
                >
                  Create Job Posting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
