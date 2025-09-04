import React, { useState } from 'react';
import { ArrowLeft, Search, Bot, MessageCircle, Calendar, Star, MapPin, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import JobSearch from './JobSearch';
import AgenticBiddingService from './AgenticBiddingService';
import CustomerCommunication from './CustomerCommunication';
import WorkPipeline from './WorkPipeline';

interface ServiceProviderDashboardProps {
  onBack: () => void;
}

export default function ServiceProviderDashboard({ onBack }: ServiceProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState('search');

  // Mock data for dashboard overview
  const dashboardStats = {
    activeBids: 12,
    wonJobs: 8,
    revenue: 15420,
    rating: 4.8,
    completionRate: 94
  };

  const recentActivity = [
    { id: 1, type: 'bid_won', description: 'Kitchen renovation bid accepted', time: '2 hours ago', amount: 2800 },
    { id: 2, type: 'new_message', description: 'New message from Sarah M.', time: '4 hours ago' },
    { id: 3, type: 'job_completed', description: 'Bathroom plumbing job completed', time: '1 day ago', amount: 650 },
    { id: 4, type: 'agentic_bid', description: 'AI submitted bid for roof repair', time: '2 days ago', amount: 1200 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{dashboardStats.rating}</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {dashboardStats.completionRate}% Complete Rate
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.activeBids}</p>
                  <p className="text-sm text-gray-600">Active Bids</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.wonJobs}</p>
                  <p className="text-sm text-gray-600">Jobs Won</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">${dashboardStats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardStats.rating}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">AI</p>
                  <p className="text-sm text-gray-600">Auto-Bidding</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Job Search</span>
            </TabsTrigger>
            <TabsTrigger value="ai-bidding" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>AI Bidding</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Work Pipeline</span>
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <TabsContent value="search">
                <JobSearch />
              </TabsContent>

              <TabsContent value="ai-bidding">
                <AgenticBiddingService />
              </TabsContent>

              <TabsContent value="communication">
                <CustomerCommunication />
              </TabsContent>

              <TabsContent value="pipeline">
                <WorkPipeline />
              </TabsContent>
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        activity.type === 'bid_won' ? 'bg-green-500' :
                        activity.type === 'new_message' ? 'bg-blue-500' :
                        activity.type === 'job_completed' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.amount && (
                          <p className="text-sm font-semibold text-green-600">${activity.amount}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}