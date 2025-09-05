import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  User, 
  DollarSign, 
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Briefcase,
  AlertCircle,
  Upload
} from 'lucide-react';
import apiService from '../services/api';
import { Job, Bid } from '../models/Job';

interface WorkProgressModalProps {
  job: Job;
  bid: Bid;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (jobId: string, status: string) => void;
}

export default function WorkProgressModal({
  job,
  bid,
  isOpen,
  onClose,
  onStatusUpdate
}: WorkProgressModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressNotes, setProgressNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(job.status);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.updateJobStatus(job._id, newStatus);
      if (response.success) {
        onStatusUpdate(job._id, newStatus);
        onClose();
      } else {
        setError(response.error || 'Failed to update job status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error updating job status:', err);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return <Clock className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
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

  const canUpdateStatus = (currentStatus: string, newStatus: string) => {
    // Service providers can only update from in_progress to completed
    return currentStatus === 'in_progress' && newStatus === 'completed';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Work Progress</h2>
              <p className="text-green-100 mt-1">{job.title}</p>
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
          {/* Job Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Service:</span>
                <span>{job.serviceType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Budget:</span>
                <span>{job.budget}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Timeline:</span>
                <span>{job.timeline}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Location:</span>
                <span>{job.location}</span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Description:</span> {job.description}
              </p>
            </div>
          </div>

          {/* Your Bid Details */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Your Accepted Bid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium">Your Bid:</span>
                <span className="text-green-700 font-semibold">${bid.amount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">Your Timeline:</span>
                <span className="text-green-700">{bid.timeline}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">Bid Submitted:</span>
                <span className="text-green-700">{formatDate(bid.createdAt)}</span>
              </div>
            </div>
            {bid.description && (
              <div className="mt-3 p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Your Proposal:</span> {bid.description}
                </p>
              </div>
            )}
          </div>

          {/* Client Information */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Name:</span>
                <span className="text-blue-700">{job.posterInfo?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Email:</span>
                <span className="text-blue-700">{job.posterInfo?.email}</span>
              </div>
              {job.posterInfo?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Phone:</span>
                  <span className="text-blue-700">{job.posterInfo.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h3>
            <div className="flex items-center space-x-3">
              {getStatusIcon(job.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                {job.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Status Update Section */}
          {job.status === 'in_progress' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Update Work Status</h3>
              
              {/* Progress Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Notes (Optional)
                </label>
                <textarea
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Add any notes about your progress, materials used, or updates for the client..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>

              {/* Status Update Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleStatusUpdate('completed')}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{loading ? 'Updating...' : 'Mark as Completed'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Completed Status */}
          {job.status === 'completed' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Work Completed</h3>
                  <p className="text-green-700 text-sm">Great job! This work has been marked as completed.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
