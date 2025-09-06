import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Job, Bid, CreateBidRequest } from '../models/Job';

interface JobDetailsProps {
  job: Job;
  currentUserId?: string;
  userType?: string;
  onBack: () => void;
  onBidSubmitted?: (bid: Bid) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ 
  job, 
  currentUserId, 
  userType, 
  onBack, 
  onBidSubmitted 
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({
    amount: '',
    timeline: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job._id) {
      fetchBids();
    }
  }, [job._id]);

  const fetchBids = async () => {
    try {
      const response = await apiService.getJobBids(job._id!);
      if (response.success) {
        setBids(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId || !job._id) return;

    setLoading(true);
    setError('');

    try {
      const bidData: CreateBidRequest = {
        jobId: job._id,
        amount: parseFloat(bidForm.amount),
        timeline: bidForm.timeline,
        description: bidForm.description
      };

      console.log('Creating bid with currentUserId:', currentUserId);
      console.log('Bid data:', bidData);
      
      const response = await apiService.createBid({
        ...bidData,
        bidderId: currentUserId
      });

      if (response.success) {
        setBids(prev => [response.data, ...prev]);
        setShowBidForm(false);
        setBidForm({ amount: '', timeline: '', description: '' });
        onBidSubmitted?.(response.data);
      } else {
        setError(response.error || 'Failed to submit bid');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error submitting bid:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to accept this bid? This will close the job to other bidders.')) {
      return;
    }

    try {
      const response = await apiService.acceptBid(bidId);
      if (response.success) {
        // Refresh bids to show updated status
        fetchBids();
        // Update job status
        window.location.reload(); // Simple refresh for now
      } else {
        setError(response.error || 'Failed to accept bid');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error accepting bid:', err);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const isJobOwner = currentUserId === job.postedBy;
  const canBid = userType === 'provider' && job.status === 'open' && !isJobOwner;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          ← Back to Jobs
        </button>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(job.urgency)}`}>
            {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{job.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Service Type:</span>
                    <p className="text-gray-900">{job.serviceType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Scope:</span>
                    <p className="text-gray-900">{job.scope}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Timeline:</span>
                    <p className="text-gray-900">{job.timeline}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <p className="text-gray-900">{job.budget}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Duration</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estimated Duration:</span>
                    <p className="text-gray-900">{job.estimatedDuration}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Posted:</span>
                    <p className="text-gray-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills and Requirements */}
            {(job.skillsRequired?.length > 0 || job.specialRequirements?.length > 0) && (
              <div className="mt-6">
                {job.skillsRequired?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.specialRequirements?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.specialRequirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bids Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Bids ({bids.length})
              </h2>
              {canBid && (
                <button
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {showBidForm ? 'Cancel' : 'Submit Bid'}
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Bid Form */}
            {showBidForm && (
              <form onSubmit={handleBidSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Bid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={bidForm.amount}
                      onChange={(e) => setBidForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your bid amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <input
                      type="text"
                      value={bidForm.timeline}
                      onChange={(e) => setBidForm(prev => ({ ...prev, timeline: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2-3 days"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={bidForm.description}
                    onChange={(e) => setBidForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your approach and any additional details..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Bid'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Bids List */}
            <div className="space-y-4">
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bids yet. Be the first to bid!</p>
              ) : (
                bids.map((bid) => (
                  <div key={bid._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{bid.bidderInfo?.name}</h4>
                        <p className="text-sm text-gray-500">{formatDate(bid.createdAt)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                        <span className="text-lg font-bold text-gray-900">${bid.amount}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{bid.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Timeline: {bid.timeline}</span>
                      {isJobOwner && job.status === 'open' && bid.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptBid(bid._id!)}
                          className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 text-sm"
                        >
                          Accept Bid
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Poster</h3>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{job.posterInfo?.name}</p>
              <p className="text-sm text-gray-500">{job.posterInfo?.email}</p>
              {job.posterInfo?.phone && (
                <p className="text-sm text-gray-500">{job.posterInfo.phone}</p>
              )}
            </div>
          </div>

          {/* Job Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Bids:</span>
                <span className="font-medium">{bids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium capitalize">{job.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Urgency:</span>
                <span className="font-medium capitalize">{job.urgency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;