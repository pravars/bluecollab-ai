import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

export default function WorkPipeline() {
  const [selectedView, setSelectedView] = useState('current');

  // Mock pipeline data
  const upcomingJobs = [
    {
      id: 1,
      title: 'Kitchen Cabinet Painting',
      customer: 'Sarah Mitchell',
      location: 'Downtown Seattle',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      status: 'confirmed',
      value: 1200,
      progress: 0,
      priority: 'high',
      requirements: ['Drop cloths', 'Paint brushes', 'Primer'],
      notes: 'Customer prefers eco-friendly paint. Kitchen will be cleared by Monday morning.'
    },
    {
      id: 2,
      title: 'Bathroom Plumbing Repair',
      customer: 'Mike Johnson',
      location: 'Capitol Hill',
      startDate: '2024-01-18',
      endDate: '2024-01-18',
      status: 'pending',
      value: 450,
      progress: 0,
      priority: 'urgent',
      requirements: ['Pipe fittings', 'Plumbing tools', 'Sealant'],
      notes: 'Emergency repair - leaky pipe behind toilet. Customer available all day.'
    },
    {
      id: 3,
      title: 'Deck Staining Project',
      customer: 'Emily Chen',
      location: 'Bellevue',
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      status: 'confirmed',
      value: 800,
      progress: 25,
      priority: 'medium',
      requirements: ['Deck stain', 'Brushes', 'Power washer'],
      notes: 'Weather dependent. Have backup dates available for rain delays.'
    }
  ];

  const currentJobs = [
    {
      id: 4,
      title: 'Electrical Socket Installation',
      customer: 'David Park',
      location: 'Fremont',
      startDate: '2024-01-12',
      endDate: '2024-01-14',
      status: 'in-progress',
      value: 350,
      progress: 75,
      priority: 'medium',
      requirements: ['GFCI outlets', 'Wire nuts', 'Electrical tester'],
      notes: 'Installing 4 outlets in garage. Customer has all materials ready.'
    }
  ];

  const completedJobs = [
    {
      id: 5,
      title: 'Living Room Painting',
      customer: 'Lisa Rodriguez',
      location: 'Queen Anne',
      startDate: '2024-01-08',
      endDate: '2024-01-10',
      status: 'completed',
      value: 950,
      progress: 100,
      priority: 'medium',
      rating: 4.8,
      feedback: 'Excellent work! Very professional and clean.',
      completedDate: '2024-01-10'
    }
  ];

  const allJobs = [...currentJobs, ...upcomingJobs, ...completedJobs];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const JobCard = ({ job, showProgress = false }: { job: any; showProgress?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{job.customer}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>${job.value}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={getStatusColor(job.status)}>
                {getStatusIcon(job.status)}
                <span className="ml-1 capitalize">{job.status.replace('-', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(job.priority)}>
                {job.priority} priority
              </Badge>
            </div>

            {showProgress && job.progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="w-full" />
              </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1 mb-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDate(job.startDate)}
                  {job.endDate !== job.startDate && ` - ${formatDate(job.endDate)}`}
                </span>
              </div>
              {job.completedDate && (
                <div className="text-green-600">
                  Completed: {formatDate(job.completedDate)}
                </div>
              )}
            </div>

            {job.notes && (
              <p className="text-sm text-gray-600 italic">{job.notes}</p>
            )}

            {job.feedback && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">&ldquo;{job.feedback}&rdquo;</p>
                {job.rating && (
                  <div className="flex items-center space-x-1 mt-2">
                    <span className="text-sm font-medium text-green-700">Rating:</span>
                    <span className="text-sm text-green-700">{job.rating}/5</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="ml-4">
            {job.status === 'pending' && (
              <Button variant="outline" size="sm">Confirm</Button>
            )}
            {job.status === 'confirmed' && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Start Job
              </Button>
            )}
            {job.status === 'in-progress' && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Update Progress
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{upcomingJobs.length}</div>
            <div className="text-sm text-gray-600">Upcoming Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{currentJobs.length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${allJobs.reduce((sum, job) => sum + job.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Pipeline Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {upcomingJobs.filter(job => job.priority === 'urgent').length}
            </div>
            <div className="text-sm text-gray-600">Urgent Jobs</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Jobs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
          <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Jobs in Progress</h3>
            <Button variant="outline">Update All Progress</Button>
          </div>
          {currentJobs.map((job) => (
            <JobCard key={job.id} job={job} showProgress={true} />
          ))}
          {currentJobs.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No jobs in progress</h3>
                <p className="text-gray-400">Start working on your upcoming jobs</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Jobs</h3>
            <Button variant="outline">View Calendar</Button>
          </div>
          {upcomingJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Completed Jobs</h3>
            <Button variant="outline">Export Report</Button>
          </div>
          {completedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}