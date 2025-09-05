import React, { useState, Suspense } from 'react';
import { MessageCircle, CheckCircle, Briefcase, Search, MapPin, Star, Shield, Clock, Phone, Users, Award, ArrowRight, Menu, X, Home, DollarSign, Building } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import UserTypeSelection from './components/UserTypeSelection';
import ServiceSeekerSignIn from './components/ServiceSeekerSignIn';
import ServiceProviderSignIn from './components/ServiceProviderSignIn';
import AIEnhancedChatInterface from './components/AIEnhancedChatInterface';

// Lazy load the dashboard components
const JobPosterDashboard = React.lazy(() => import('./components/JobPosterDashboard'));
const ServiceProviderDashboard = React.lazy(() => import('./components/ServiceProviderDashboard'));

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  autoFill?: {
    category: string;
    price: string;
    timeframe: string;
    skills: string[];
    urgency?: string;
  };
}

export default function App() {
  // Basic error handling
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error caught:', error);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Load user data from localStorage on component mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('Loading user from localStorage:', storedUser);
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        setUser(userData);
        setIsSignedIn(true);
        setUserType(userData.userType === 'homeowner' ? 'seeker' : 'provider');
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);
  const [currentView, setCurrentView] = useState<'home' | 'chat' | 'ai-chat' | 'user-selection' | 'seeker-signin' | 'provider-signin' | 'job-dashboard' | 'provider-dashboard'>('home');
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userType, setUserType] = useState<'seeker' | 'provider' | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi! I'm your comprehensive home assistant. Whether you need services, financing, insurance, or real estate help—just describe what you need and I'll connect you with the right professionals.",
      sender: 'ai'
    }
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    // Enhanced AI response based on input keywords
    setTimeout(() => {
      let category = 'Home Services';
      let price = '$200-$500';
      let timeframe = '1-3 days';
      
      // Enhanced keyword matching for comprehensive home ecosystem
      const input = inputValue.toLowerCase();
      if (input.includes('paint') || input.includes('painting')) {
        category = 'Painting & Decorating';
        price = '$350-$850';
        timeframe = '2-4 days';
      } else if (input.includes('plumb') || input.includes('leak') || input.includes('faucet')) {
        category = 'Plumbing';
        price = '$180-$450';
        timeframe = '1-2 days';
      } else if (input.includes('electric') || input.includes('wiring') || input.includes('outlet')) {
        category = 'Electrical';
        price = '$220-$580';
        timeframe = '1-3 days';
      } else if (input.includes('clean') || input.includes('cleaning')) {
        category = 'Cleaning Services';
        price = '$90-$220';
        timeframe = 'Same day';
      } else if (input.includes('mortgage') || input.includes('loan') || input.includes('finance')) {
        category = 'Home Financing';
        price = '3.2% APR';
        timeframe = '30-45 days';
      } else if (input.includes('insurance') || input.includes('coverage') || input.includes('claim')) {
        category = 'Home Insurance';
        price = '$85/month';
        timeframe = '1-7 days';
      } else if (input.includes('buy') || input.includes('sell') || input.includes('realtor') || input.includes('real estate')) {
        category = 'Real Estate';
        price = '5.5% commission';
        timeframe = '30-90 days';
      } else if (input.includes('refinance') || input.includes('refi')) {
        category = 'Refinancing';
        price = '2.9% APR';
        timeframe = '30-45 days';
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `🎨 Perfect! I've analyzed your ${category.toLowerCase()} request and found qualified providers in your area.`,
        sender: 'ai',
        autoFill: {
          category,
          price,
          timeframe,
          skills: ['Professional Service', 'Licensed & Insured'],
          urgency: 'Standard'
        }
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Set the search query as input and navigate to chat
      setInputValue(searchQuery);
      setCurrentView('chat');
      // Auto-send the search message
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now(),
          text: searchQuery,
          sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Generate AI response
        setTimeout(() => {
          let category = 'Home Services';
          let price = '$200-$500';
          let timeframe = '1-3 days';
          
          const input = searchQuery.toLowerCase();
          if (input.includes('paint') || input.includes('painting')) {
            category = 'Painting & Decorating';
            price = '$350-$850';
            timeframe = '2-4 days';
          } else if (input.includes('plumb') || input.includes('leak') || input.includes('faucet')) {
            category = 'Plumbing';
            price = '$180-$450';
            timeframe = '1-2 days';
          } else if (input.includes('electric') || input.includes('wiring') || input.includes('outlet')) {
            category = 'Electrical';
            price = '$220-$580';
            timeframe = '1-3 days';
          } else if (input.includes('clean') || input.includes('cleaning')) {
            category = 'Cleaning Services';
            price = '$90-$220';
            timeframe = 'Same day';
          } else if (input.includes('mortgage') || input.includes('loan') || input.includes('finance')) {
            category = 'Home Financing';
            price = '3.2% APR';
            timeframe = '30-45 days';
          } else if (input.includes('insurance') || input.includes('coverage') || input.includes('claim')) {
            category = 'Home Insurance';
            price = '$85/month';
            timeframe = '1-7 days';
          } else if (input.includes('buy') || input.includes('sell') || input.includes('realtor') || input.includes('real estate')) {
            category = 'Real Estate';
            price = '5.5% commission';
            timeframe = '30-90 days';
          } else if (input.includes('refinance') || input.includes('refi')) {
            category = 'Refinancing';
            price = '2.9% APR';
            timeframe = '30-45 days';
          }

          const aiMessage: Message = {
            id: Date.now() + 1,
            text: `🎯 Great! I found ${Math.floor(Math.random() * 50) + 10} qualified ${category.toLowerCase()} providers in ${selectedLocation || 'your area'}.`,
            sender: 'ai',
            autoFill: {
              category,
              price,
              timeframe,
              skills: ['Professional Service', 'Licensed & Insured'],
              urgency: 'Standard'
            }
          };

          setMessages(prev => [...prev, aiMessage]);
        }, 1000);
        
        setSearchQuery('');
      }, 500);
    }
  };

  const handleSignIn = (userData: any, token: string, type?: 'seeker' | 'provider') => {
    setIsLoading(true);
    setError(null);
    
    // Store user data and token
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    setUser(userData);
    setIsSignedIn(true);
    setUserType(type || (userData.userType === 'homeowner' ? 'seeker' : 'provider'));
    setCurrentView('home');
    setIsLoading(false);
  };

  const handleSignOut = () => {
    setIsLoading(true);
    // Clear stored data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    setUser(null);
    setIsSignedIn(false);
    setUserType(null);
    setCurrentView('home');
    setIsLoading(false);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => {
              setError(null);
              setCurrentView('home');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-lg font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // View routing
  if (currentView === 'job-dashboard') {
    console.log('Rendering JobPosterDashboard with user:', user);
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <JobPosterDashboard 
            onBack={() => setCurrentView('home')}
            userId={user?._id || ''}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentView === 'provider-dashboard') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ServiceProviderDashboard 
            onBack={() => setCurrentView('home')}
            userId={user?._id || ''}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }


  if (currentView === 'user-selection') {
    return (
      <UserTypeSelection 
        onBack={() => setCurrentView('home')}
        onSelectSeeker={() => setCurrentView('seeker-signin')}
        onSelectProvider={() => setCurrentView('provider-signin')}
      />
    );
  }

  if (currentView === 'seeker-signin') {
    return (
      <ServiceSeekerSignIn 
        onBack={() => setCurrentView('user-selection')}
        onSignIn={(user, token) => handleSignIn(user, token, 'seeker')}
      />
    );
  }

  if (currentView === 'provider-signin') {
    return (
      <ServiceProviderSignIn 
        onBack={() => setCurrentView('user-selection')}
        onSignIn={(user, token) => handleSignIn(user, token, 'provider')}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold">HavenHub Assistant</h2>
                  </div>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    ← Home
                  </button>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      
                      {message.autoFill && (
                        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-800">Auto-Generated</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div>Service: {message.autoFill.category}</div>
                            <div>Price: {message.autoFill.price}</div>
                            <div>Timeline: {message.autoFill.timeframe}</div>
                          </div>
                          <button 
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors"
                            onClick={() => {
                              if (isSignedIn && userType === 'seeker') {
                                setCurrentView('job-dashboard');
                              } else {
                                setCurrentView('user-selection');
                              }
                            }}
                          >
                            {isSignedIn && userType === 'seeker' ? 'Post Job' : 'Sign In to Post Job'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your service need..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'ai-chat') {
    return (
      <AIEnhancedChatInterface 
        onBack={() => setCurrentView('home')}
        onJobCreated={(jobDetails) => {
          console.log('Job created:', jobDetails);
          // Here you can integrate with your job posting system
          setCurrentView('job-dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HavenHub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
              </nav>
              
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user ? `${user.firstName} ${user.lastName}` : (userType === 'seeker' ? 'Homeowner' : 'Provider')}!
                  </span>
                  {userType === 'seeker' && (
                    <button 
                      onClick={() => setCurrentView('job-dashboard')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>My Jobs</span>
                    </button>
                  )}
                  {userType === 'provider' && (
                    <button 
                      onClick={() => setCurrentView('provider-dashboard')}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Find Jobs</span>
                    </button>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setCurrentView('user-selection')}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setCurrentView('user-selection')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 mt-4">
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Reviews</a>
                {isSignedIn ? (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                    {userType === 'seeker' && (
                      <button 
                        onClick={() => setCurrentView('job-dashboard')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2 justify-center"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>My Jobs</span>
                      </button>
                    )}
                    {userType === 'provider' && (
                      <button 
                        onClick={() => setCurrentView('provider-dashboard')}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2 justify-center"
                      >
                        <Search className="w-4 h-4" />
                        <span>Find Jobs</span>
                      </button>
                    )}
                    <button 
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setCurrentView('user-selection')}
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors border border-gray-300 rounded-lg"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setCurrentView('user-selection')}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Your Complete Home
                  </span>
                  <br />
                  <span className="text-gray-800">Ecosystem Platform</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Connect with trusted professionals for home services, financing, insurance, and real estate—all powered by AI agents that understand your unique needs.
                </p>
                
                {/* Prominent Search Bar */}
                <div className="bg-white rounded-2xl p-4 shadow-lg mb-8 border border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="What do you need? (e.g., home repair, mortgage, insurance, realtor)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:w-48 relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        placeholder="Your location"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setCurrentView('chat')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3 shadow-lg"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Try AI Assistant</span>
                    </button>
                    
                    <button 
                      onClick={() => setCurrentView('ai-chat')}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3 shadow-lg"
                    >
                      <Briefcase className="w-6 h-6" />
                      <span>AI Job Creator</span>
                    </button>
                  </div>
                  
                  {!isSignedIn && (
                    <button 
                      onClick={() => setCurrentView('user-selection')}
                      className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 hover:border-blue-300 rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3"
                    >
                      <Users className="w-6 h-6" />
                      <span>Join as Professional</span>
                    </button>
                  )}

                  
                  {isSignedIn && userType === 'provider' && (
                    <button 
                      onClick={() => setCurrentView('provider-dashboard')}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold text-lg transition-colors flex items-center justify-center space-x-3 shadow-lg"
                    >
                      <Search className="w-6 h-6" />
                      <span>Find & Bid Jobs</span>
                    </button>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Verified Professionals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Quick Matching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span>Quality Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1586333109867-812586269a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXNtYW4lMjB3b3JraW5nfGVufDF8fHx8MTc1NjkxNDA0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Professional tradesman at work"
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">50K+</div>
                      <div className="text-xs text-gray-600">Professionals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">4.9★</div>
                      <div className="text-xs text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Verified Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Complete Home Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From home services to financing, insurance, and real estate—everything you need for your home in one integrated platform
            </p>
          </div>

          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            <div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              onClick={() => {
                setSearchQuery('Home Services');
                handleSearch();
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white">
                <Home className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Home Services</h3>
              <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">Maintenance, repairs & renovations</p>
              
              <div className="space-y-2 mb-6">
                {['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Painting', 'Landscaping'].map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">Explore Options</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              onClick={() => {
                setSearchQuery('Home Financing');
                handleSearch();
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white">
                <DollarSign className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Home Financing</h3>
              <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">Mortgages, refinancing & home loans</p>
              
              <div className="space-y-2 mb-6">
                {['Mortgages', 'Refinancing', 'Home Equity', 'Construction Loans'].map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-green-600 group-hover:text-green-700 transition-colors">
                  <span className="text-sm font-medium">Explore Options</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              onClick={() => {
                setSearchQuery('Home Insurance');
                handleSearch();
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white">
                <Shield className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Home Insurance</h3>
              <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">Protect your investment with coverage</p>
              
              <div className="space-y-2 mb-6">
                {['Home Insurance', 'Flood Insurance', 'Umbrella Policy', 'Claims Support'].map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
                  <span className="text-sm font-medium">Explore Options</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100 group"
              onClick={() => {
                setSearchQuery('Real Estate');
                handleSearch();
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-white">
                <Building className="w-12 h-12" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center">Real Estate</h3>
              <p className="text-gray-600 mb-4 text-center text-sm leading-relaxed">Buy, sell & invest in properties</p>
              
              <div className="space-y-2 mb-6">
                {['Buying', 'Selling', 'Investment', 'Property Management'].map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-indigo-600 group-hover:text-indigo-700 transition-colors">
                  <span className="text-sm font-medium">Explore Options</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Services Grid */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Popular Services</h3>
            <p className="text-gray-600 mb-8">Quick access to our most requested services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Painting'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎨</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Painting</h4>
              <p className="text-xs text-green-600 font-medium">$350-$850</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Plumbing'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔧</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Plumbing</h4>
              <p className="text-xs text-green-600 font-medium">$180-$450</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Electrical'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Electrical</h4>
              <p className="text-xs text-green-600 font-medium">$220-$580</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Cleaning'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🧽</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Cleaning</h4>
              <p className="text-xs text-green-600 font-medium">$90-$220</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Mortgage'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏦</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Mortgage</h4>
              <p className="text-xs text-green-600 font-medium">3.2% APR*</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Insurance'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🛡️</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Insurance</h4>
              <p className="text-xs text-green-600 font-medium">$80/month*</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Buy Home'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏠</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Buy Home</h4>
              <p className="text-xs text-green-600 font-medium">Market Rate</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Sell Home'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📈</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Sell Home</h4>
              <p className="text-xs text-green-600 font-medium">5.5% Commission*</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Handyman'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔨</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Handyman</h4>
              <p className="text-xs text-green-600 font-medium">$120-$300</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Landscaping'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌿</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Landscaping</h4>
              <p className="text-xs text-green-600 font-medium">$200-$800</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Refinance'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Refinance</h4>
              <p className="text-xs text-green-600 font-medium">2.9% APR*</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 group text-center" onClick={() => { setSearchQuery('Property Mgmt'); handleSearch(); }}>
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏘️</div>
              <h4 className="font-semibold text-sm mb-1 text-gray-800">Property Mgmt</h4>
              <p className="text-xs text-green-600 font-medium">8-12% fee*</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How Our Ecosystem Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered matching connects you with the right professionals across all aspects of homeownership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">1. Tell Us Your Needs</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Describe any home-related need: repairs, financing, insurance claims, or buying/selling property.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">2. AI Agent Matching</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Our specialized AI agents instantly match you with verified professionals in the right category.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">3. Compare & Choose</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Review proposals, rates, and reviews from multiple professionals. Make informed decisions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">4. Complete & Track</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Work with your chosen professional and track progress through our integrated platform.
              </p>
            </div>
          </div>

          {/* AI Agents Feature */}
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Powered by Specialized AI Agents</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each area of homeownership has dedicated AI agents trained to understand your specific needs and match you with the best professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-3xl mb-4">🛠️</div>
                <h4 className="font-bold text-gray-800 mb-2">Service Agent</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Matches contractors and service providers based on project requirements</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-3xl mb-4">💰</div>
                <h4 className="font-bold text-gray-800 mb-2">Finance Agent</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Connects with lenders and finds the best financing options</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-3xl mb-4">🛡️</div>
                <h4 className="font-bold text-gray-800 mb-2">Insurance Agent</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Analyzes coverage needs and finds optimal insurance solutions</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="text-3xl mb-4">🏘️</div>
                <h4 className="font-bold text-gray-800 mb-2">Realty Agent</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Assists with buying, selling, and property investment decisions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied homeowners and professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1446501356021-84cf6b450d07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcmV2aWV3JTIwdGVzdGltb25pYWx8ZW58MXx8fHwxNzU2OTM5OTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="Sarah Johnson"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Homeowner</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"HavenHub helped me find contractors for my renovation AND connected me with a great refinance option to fund it. Everything in one place!"</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">Home Renovation + Financing</span>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Verified Review
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1586333109867-812586269a58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0cmFkZXNtYW4lMjB3b3JraW5nfGVufDF8fHx8MTc1NjkxNDA0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="David Martinez"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">David Martinez</h4>
                  <p className="text-gray-600 text-sm">Real Estate Agent</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"The platform connects my buyers with mortgage brokers and insurance agents seamlessly. My clients love the integrated experience."</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">Real Estate Services</span>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Verified Review
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1753977725475-41b221add2c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVub3ZhdGlvbiUyMGJlZm9yZSUyMGFmdGVyfGVufDF8fHx8MTc1NjgzMTExMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="Emily Chen"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">Emily Chen</h4>
                  <p className="text-gray-600 text-sm">Homeowner</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"From getting insurance coverage to finding contractors for storm damage repairs—HavenHub handled my entire claim process efficiently."</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium">Insurance + Repairs</span>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Verified Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of homeowners and professionals who trust HavenHub for comprehensive home solutions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => setCurrentView('user-selection')}
                className="px-10 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center space-x-3 shadow-lg"
              >
                <Users className="w-6 h-6" />
                <span>Post a Job</span>
              </button>
              
              <button 
                onClick={() => setCurrentView('user-selection')}
                className="px-10 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center space-x-3"
              >
                <Briefcase className="w-6 h-6" />
                <span>Join as Professional</span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center text-blue-100">
              <Phone className="w-5 h-5 mr-2" />
              <span>24/7 Customer Support: 1-888-SERVICE</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">HavenHub</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The comprehensive home ecosystem platform connecting homeowners with trusted professionals across services, finance, insurance, and real estate.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Quality Guaranteed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">For Homeowners</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Get Financing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance Coverage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buy/Sell Home</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">For Professionals</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Service Providers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lenders & Brokers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance Agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Real Estate Pros</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 HavenHub. All rights reserved. | Privacy Policy | Terms of Service
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Available 24/7</span>
                <div className="flex items-center text-sm text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Live Support Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}