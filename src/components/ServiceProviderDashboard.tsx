import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Eye,
  Briefcase,
  Settings
} from 'lucide-react';
import JobListing from './JobListing';
import JobDetails from './JobDetails';
import WorkProgressModal from './WorkProgressModal';
import apiService from '../services/api';
import { Job, Bid } from '../models/Job';

interface ServiceProviderDashboardProps {
  onBack: () => void;
  userId: string;
}

export default function ServiceProviderDashboard({ onBack, userId }: ServiceProviderDashboardProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'browse-jobs' | 'job-details' | 'my-bids'>('dashboard');
  const [workProgressOpen, setWorkProgressOpen] = useState(false);
  const [selectedJobForProgress, setSelectedJobForProgress] = useState<Job | null>(null);
  const [selectedBidForProgress, setSelectedBidForProgress] = useState<Bid | null>(null);

  useEffect(() => {
    fetchMyBids();
  }, [userId]);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBidderBids(userId);
      if (response.success) {
        setMyBids(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch bids');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('job-details');
  };

  const handleBidSubmitted = (bid: Bid) => {
    // Refresh my bids list
    fetchMyBids();
  };

  const handleWorkProgress = (job: Job, bid: Bid) => {
    setSelectedJobForProgress(job);
    setSelectedBidForProgress(bid);
    setWorkProgressOpen(true);
  };

  const handleJobStatusUpdate = (jobId: string, status: string) => {
    // Update the job status in the bids list
    setMyBids(prev => prev.map(bid => 
      bid.job?._id === jobId 
        ? { ...bid, job: { ...bid.job!, status } }
        : bid
    ));
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (currentView === 'browse-jobs') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            <JobListing onJobSelect={handleJobSelect} />
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'job-details' && selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        currentUserId={userId}
        userType="provider"
        onBack={() => setCurrentView('browse-jobs')}
        onBidSubmitted={handleBidSubmitted}
      />
    );
  }

  if (currentView === 'my-bids') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
              >
                <span>← Back to Dashboard</span>
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
                <h1 className="text-2xl font-bold">My Bids</h1>
                <p className="text-green-100">Track your submitted bids and their status</p>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bids</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={fetchMyBids}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : myBids.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">💼</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bids submitted yet</h3>
                    <p className="text-gray-500 mb-4">Start browsing jobs to submit your first bid!</p>
                    <button
                      onClick={() => setCurrentView('browse-jobs')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    >
                      Browse Jobs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBids.map((bid) => (
                      <div key={bid._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {bid.job?.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {bid.job?.description}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>My Bid: ${bid.amount}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Timeline: {bid.timeline}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{bid.job?.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>Submitted: {formatDate(bid.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBidStatusColor(bid.status)}`}>
                              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedJob(bid.job);
                                  setCurrentView('job-details');
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                View Job
                              </button>
                              {bid.status === 'accepted' && bid.job && (
                                <button
                                  onClick={() => handleWorkProgress(bid.job!, bid)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Work Progress</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {bid.description && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">My Proposal:</span> {bid.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6" />
                  <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
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
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {myBids.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Bids</div>
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
                      {myBids.filter(bid => bid.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {myBids.filter(bid => bid.status === 'accepted').length}
                    </div>
                    <div className="text-sm text-gray-600">Accepted</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      ${myBids
                        .filter(bid => bid.status === 'accepted')
                        .reduce((total, bid) => total + bid.amount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div 
              onClick={() => setCurrentView('browse-jobs')}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Browse Jobs</h3>
                  <p className="text-gray-600">Find new opportunities to bid on</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('my-bids')}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">My Bids</h3>
                  <p className="text-gray-600">Track your submitted bids</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bids */}
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Recent Bids</h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : myBids.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💼</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
                  <p className="text-gray-500 mb-4">Start browsing jobs to submit your first bid!</p>
                  <button
                    onClick={() => setCurrentView('browse-jobs')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBids.slice(0, 3).map((bid) => (
                    <div key={bid._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{bid.job?.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">My bid: ${bid.amount} • {bid.timeline}</p>
                          {bid.status === 'accepted' && bid.job && (
                            <button
                              onClick={() => handleWorkProgress(bid.job!, bid)}
                              className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors flex items-center space-x-1"
                            >
                              <Settings className="w-3 h-3" />
                              <span>Work Progress</span>
                            </button>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {myBids.length > 3 && (
                    <button
                      onClick={() => setCurrentView('my-bids')}
                      className="w-full text-center py-3 text-green-600 hover:text-green-700 font-medium"
                    >
                      View All Bids ({myBids.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Work Progress Modal */}
      {selectedJobForProgress && selectedBidForProgress && (
        <WorkProgressModal
          job={selectedJobForProgress}
          bid={selectedBidForProgress}
          isOpen={workProgressOpen}
          onClose={() => {
            setWorkProgressOpen(false);
            setSelectedJobForProgress(null);
            setSelectedBidForProgress(null);
          }}
          onStatusUpdate={handleJobStatusUpdate}
        />
      )}
    </div>
  );
}