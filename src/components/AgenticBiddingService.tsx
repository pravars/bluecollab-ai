import React, { useState } from 'react';
import { Bot, Settings, TrendingUp, Target, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function AgenticBiddingService() {
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [bidRadius, setBidRadius] = useState([15]);
  const [maxBidsPerDay, setMaxBidsPerDay] = useState([8]);
  const [minProjectValue, setMinProjectValue] = useState([200]);
  const [maxProjectValue, setMaxProjectValue] = useState([2000]);
  const [activeTab, setActiveTab] = useState('settings');

  // Mock data for AI bidding service
  const agentStats = {
    totalBids: 127,
    wonBids: 34,
    winRate: 26.8,
    avgBidTime: '2.3 minutes',
    revenueGenerated: 23450,
    activeCategories: ['Painting', 'Plumbing', 'Electrical']
  };

  const recentAgentActivity = [
    {
      id: 1,
      jobTitle: 'Kitchen Cabinet Refinishing',
      bidAmount: 850,
      status: 'won',
      timestamp: '2 hours ago',
      confidence: 92
    },
    {
      id: 2,
      jobTitle: 'Bathroom Tile Repair',
      bidAmount: 320,
      status: 'pending',
      timestamp: '4 hours ago',
      confidence: 78
    },
    {
      id: 3,
      jobTitle: 'Outdoor Deck Staining',
      bidAmount: 680,
      status: 'lost',
      timestamp: '6 hours ago',
      confidence: 85
    },
    {
      id: 4,
      jobTitle: 'Electrical Socket Installation',
      bidAmount: 275,
      status: 'won',
      timestamp: '8 hours ago',
      confidence: 96
    }
  ];

  const biddingStrategies = [
    {
      name: 'Aggressive',
      description: 'Lower bids to win more jobs',
      multiplier: 0.85,
      riskLevel: 'High'
    },
    {
      name: 'Balanced',
      description: 'Optimal pricing for profit and wins',
      multiplier: 1.0,
      riskLevel: 'Medium'
    },
    {
      name: 'Premium',
      description: 'Higher bids for better margins',
      multiplier: 1.15,
      riskLevel: 'Low'
    }
  ];

  const [selectedStrategy, setSelectedStrategy] = useState('Balanced');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'lost': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Status Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Bidding Agent</h3>
                <p className="text-sm text-gray-600">Autonomous job bidding powered by machine learning</p>
              </div>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Agent Status:</span>
                <Switch 
                  checked={isAgentActive} 
                  onCheckedChange={setIsAgentActive}
                />
                <Badge className={isAgentActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {isAgentActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{agentStats.totalBids}</div>
              <div className="text-sm text-gray-600">Total Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{agentStats.wonBids}</div>
              <div className="text-sm text-gray-600">Won Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{agentStats.winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${agentStats.revenueGenerated.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Agent Settings</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          {/* Bidding Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Bidding Strategy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {biddingStrategies.map((strategy) => (
                  <div
                    key={strategy.name}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedStrategy === strategy.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStrategy(strategy.name)}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">{strategy.name}</h4>
                      <p className="text-sm text-gray-600 my-2">{strategy.description}</p>
                      <Badge variant={strategy.riskLevel === 'High' ? 'destructive' : 
                                   strategy.riskLevel === 'Medium' ? 'default' : 'secondary'}>
                        {strategy.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Agent Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidding Radius: {bidRadius[0]} miles
                </label>
                <Slider
                  value={bidRadius}
                  onValueChange={setBidRadius}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Bids Per Day: {maxBidsPerDay[0]}
                </label>
                <Slider
                  value={maxBidsPerDay}
                  onValueChange={setMaxBidsPerDay}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Project Value: ${minProjectValue[0]}
                  </label>
                  <Slider
                    value={minProjectValue}
                    onValueChange={setMinProjectValue}
                    max={1000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Project Value: ${maxProjectValue[0]}
                  </label>
                  <Slider
                    value={maxProjectValue}
                    onValueChange={setMaxProjectValue}
                    max={5000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {agentStats.activeCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-purple-100 text-purple-800">
                      {category}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm">+ Add Category</Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Bidding Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAgentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.jobTitle}</h4>
                        <p className="text-sm text-gray-600">{activity.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold">${activity.bidAmount}</p>
                        <p className="text-sm text-gray-600">{activity.confidence}% confidence</p>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Bid Response Time</span>
                    <span className="font-semibold">{agentStats.avgBidTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Win Rate Trend</span>
                    <span className="font-semibold text-green-600">↑ 3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue per Bid</span>
                    <span className="font-semibold">${(agentStats.revenueGenerated / agentStats.totalBids).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">Pro Agent</h3>
                    <p className="text-gray-600">Advanced AI bidding with premium features</p>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">$49/month</div>
                  <ul className="text-sm space-y-2 text-left">
                    <li>✓ Unlimited AI bids</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Custom bidding strategies</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Upgrade Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}