import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  DollarSign, 
  Calendar,
  Star,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';
import apiService from '../services/api';
import { Job, Bid } from '../models/Job';

interface BidManagementModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onBidAccepted: (bidId: string) => void;
  onBidRejected: (bidId: string) => void;
  onJobStatusUpdate: (jobId: string, status: string) => void;
}

export default function BidManagementModal({
  job,
  isOpen,
  onClose,
  onBidAccepted,
  onBidRejected,
  onJobStatusUpdate
}: BidManagementModalProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && job._id) {
      fetchBids();
    }
  }, [isOpen, job._id]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await apiService.getJobBids(job._id);
      if (response.success) {
        setBids(response.data || []);
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

  const handleAcceptBid = async (bidId: string) => {
    try {
      setActionLoading(bidId);
      const response = await apiService.acceptBid(bidId);
      if (response.success) {
        onBidAccepted(bidId);
        onJobStatusUpdate(job._id, 'in_progress');
        // Refresh bids to update statuses
        await fetchBids();
      } else {
        setError(response.error || 'Failed to accept bid');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error accepting bid:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      setActionLoading(bidId);
      // For now, we'll just update the bid status to rejected
      // In a real app, you might want a dedicated reject endpoint
      onBidRejected(bidId);
      // Refresh bids
      await fetchBids();
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error rejecting bid:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleWorkStatusUpdate = async (newStatus: string) => {
    try {
      setActionLoading('work-status');
      const response = await apiService.updateJobStatus(job._id, newStatus);
      if (response.success) {
        onJobStatusUpdate(job._id, newStatus);
      } else {
        setError(response.error || 'Failed to update job status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error updating job status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const acceptedBid = bids.find(bid => bid.status === 'accepted');
  const pendingBids = bids.filter(bid => bid.status === 'pending');
  const rejectedBids = bids.filter(bid => bid.status === 'rejected');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Manage Bids</h2>
              <p className="text-blue-100 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Job Status Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Job Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              {job.status === 'in_progress' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWorkStatusUpdate('completed')}
                    disabled={actionLoading === 'work-status'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Accepted Bid */}
              {acceptedBid && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Accepted Bid</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{acceptedBid.bidderInfo?.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">${acceptedBid.amount}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{acceptedBid.timeline}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Submitted {formatDate(acceptedBid.createdAt)}</span>
                          </div>
                        </div>
                        {acceptedBid.description && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Proposal:</span> {acceptedBid.description}
                            </p>
                          </div>
                        )}
                        <div className="mt-3 flex space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{acceptedBid.bidderInfo?.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{acceptedBid.bidderInfo?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Bids */}
              {pendingBids.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pending Bids ({pendingBids.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingBids.map((bid) => (
                      <div key={bid._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{bid.bidderInfo?.name}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm text-gray-600">4.8</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                                {bid.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">${bid.amount}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{bid.timeline}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Submitted {formatDate(bid.createdAt)}</span>
                              </div>
                            </div>
                            {bid.description && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Proposal:</span> {bid.description}
                                </p>
                              </div>
                            )}
                            
                            {/* Material Estimate */}
                            {bid.materialEstimate && (
                              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-blue-900">Material Estimate</h4>
                                  <div className="flex items-center space-x-2">
                                    {bid.materialEstimate.store === 'Home Depot' && (
                                      <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">HD</span>
                                      </div>
                                    )}
                                    {bid.materialEstimate.store === 'Lowes' && (
                                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">L</span>
                                      </div>
                                    )}
                                    {bid.materialEstimate.store === 'Menards' && (
                                      <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">M</span>
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-blue-800">{bid.materialEstimate.store}</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 mb-3">
                                  {bid.materialEstimate.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <div className="flex-1">
                                        <span className="text-gray-700">{item.name}</span>
                                        <span className="text-gray-500 ml-2">({item.quantity})</span>
                                      </div>
                                      <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="border-t border-blue-200 pt-2 flex justify-between items-center">
                                  <span className="font-semibold text-blue-900">Total Materials:</span>
                                  <span className="font-bold text-blue-900">${bid.materialEstimate.total.toFixed(2)}</span>
                                </div>
                                
                                {bid.materialEstimate.storeLink && (
                                  <div className="mt-2">
                                    <a 
                                      href={bid.materialEstimate.storeLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View on {bid.materialEstimate.store} →
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="mt-3 flex space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{bid.bidderInfo?.phone || 'Not provided'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{bid.bidderInfo?.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptBid(bid._id)}
                              disabled={actionLoading === bid._id || acceptedBid}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectBid(bid._id)}
                              disabled={actionLoading === bid._id}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected Bids */}
              {rejectedBids.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rejected Bids ({rejectedBids.length})
                  </h3>
                  <div className="space-y-4">
                    {rejectedBids.map((bid) => (
                      <div key={bid._id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-75">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{bid.bidderInfo?.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBidStatusColor(bid.status)}`}>
                                {bid.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>${bid.amount}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{bid.timeline}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Submitted {formatDate(bid.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Bids Message */}
              {bids.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💼</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h3>
                  <p className="text-gray-500">Bids will appear here when service providers submit them.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
