import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Calendar,
  MapPin
} from 'lucide-react';
import JobDetails from './JobDetails';
import BidManagement from './BidManagement-clean';
import JobProgress from './JobProgress';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  location: string;
  status: 'open' | 'in-progress' | 'completed';
  postedDate: string;
  bidCount: number;
  urgency: 'low' | 'medium' | 'high';
}

interface JobPosterDashboardProps {
  onBack: () => void;
}

export default function JobPosterDashboard({ onBack }: JobPosterDashboardProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'job-details' | 'bid-management' | 'job-progress'>('dashboard');

  // Mock job data
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Living room painting',
      description: 'Need to paint my living room walls. Room is approximately 15x12 feet with high ceilings.',
      category: 'Painting',
      budget: '$400-$600',
      location: 'Downtown, TX',
      status: 'open',
      postedDate: '2025-01-15',
      bidCount: 8,
      urgency: 'medium'
    },
    {
      id: '2',
      title: 'Kitchen plumbing repair',
      description: 'Leaky faucet and garbage disposal installation needed.',
      category: 'Plumbing',
      budget: '$200-$400',
      location: 'Suburbia, TX',
      status: 'in-progress',
      postedDate: '2025-01-10',
      bidCount: 5,
      urgency: 'high'
    },
    {
      id: '3',
      title: 'Bathroom tile installation',
      description: 'Replace old bathroom tiles with new ceramic tiles. 50 sq ft area.',
      category: 'Flooring',
      budget: '$800-$1200',
      location: 'Midtown, TX',
      status: 'completed',
      postedDate: '2025-01-05',
      bidCount: 12,
      urgency: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  // Handle different views
  if (currentView === 'job-details' && selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            <JobDetails job={selectedJob} />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'bid-management' && selectedJobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
                <h1 className="text-2xl font-bold">Manage Bids - {selectedJob?.title}</h1>
              </div>
            </div>
            <BidManagement jobId={selectedJobId} />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'job-progress' && selectedJobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-lg mb-6">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl">
                <h1 className="text-2xl font-bold">Job Progress - {selectedJob?.title}</h1>
              </div>
            </div>
            <JobProgress jobId={selectedJobId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6" />
                  <h1 className="text-2xl font-bold">Job Poster Dashboard</h1>
                </div>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
                    <div className="text-sm text-gray-600">Total Jobs</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {jobs.filter(job => job.status === 'in-progress').length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {jobs.filter(job => job.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {jobs.reduce((total, job) => total + job.bidCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Bids</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Your Posted Jobs</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                          {job.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(job.urgency)}`}>
                          {job.urgency.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.budget}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.bidCount} bids</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <button 
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setCurrentView('job-details');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setCurrentView('bid-management');
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Manage Bids ({job.bidCount})
                      </button>
                      {job.status === 'in-progress' && (
                        <button 
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setCurrentView('job-progress');
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          View Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-blue-800">Post New Job</div>
                      <div className="text-sm text-blue-600">Create a new service request</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-800">Review Bids</div>
                      <div className="text-sm text-green-600">Check pending applications</div>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-purple-800">View History</div>
                      <div className="text-sm text-purple-600">See completed projects</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}