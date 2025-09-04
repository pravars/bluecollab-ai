import { MessageCircle, Home, Briefcase, ArrowRight, Star, Users, CheckCircle } from 'lucide-react';

interface UserTypeSelectionProps {
  onBack: () => void;
  onSelectSeeker: () => void;
  onSelectProvider: () => void;
}

export default function UserTypeSelection({ onBack, onSelectSeeker, onSelectProvider }: UserTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to home</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ServiceAI
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How would you like to use ServiceAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with the right experience for your needs
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Service Seeker Card */}
          <div 
            onClick={onSelectSeeker}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                I Need Services
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a homeowner looking for trusted professionals to help with home improvement, maintenance, and repairs.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Find vetted professionals instantly</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI-powered project cost estimation</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compare quotes and reviews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure payments and guarantees</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl group-hover:transform group-hover:scale-105">
                Continue as Homeowner
              </button>
              
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>Join 2M+ satisfied homeowners</span>
              </div>
            </div>
          </div>

          {/* Service Provider Card */}
          <div 
            onClick={onSelectProvider}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-purple-50"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors">
                I Provide Services
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a professional contractor, handyman, or service provider ready to connect with customers who need my expertise.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Get matched with quality leads</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Manage jobs and payments easily</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Build reputation with reviews</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Grow your business with analytics</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg text-center transition-all duration-200 shadow-lg hover:shadow-xl group-hover:transform group-hover:scale-105">
                Continue as Professional
              </button>
              
              <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Join 50K+ verified providers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-800 mb-2">New to ServiceAI?</h4>
            <p className="text-sm text-gray-600">
              Both options include account creation if you're new. We'll guide you through the setup process 
              and help you get the most out of our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}