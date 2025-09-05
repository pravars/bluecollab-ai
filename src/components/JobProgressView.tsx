import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  User, 
  DollarSign, 
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Image,
  FileText,
  Star,
  Send,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import apiService from '../services/api';
import { Job, Bid } from '../models/Job';

interface ProgressUpdate {
  _id: string;
  jobId: string;
  providerId: string;
  providerName: string;
  type: 'status_update' | 'message' | 'file_upload' | 'photo' | 'milestone';
  title: string;
  content: string;
  files?: string[];
  status?: string;
  createdAt: string;
  isRead: boolean;
}

interface JobProgressViewProps {
  job: Job;
  bid: Bid;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (jobId: string, status: string) => void;
}

export default function JobProgressView({
  job,
  bid,
  isOpen,
  onClose,
  onStatusUpdate
}: JobProgressViewProps) {
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isOpen && job._id) {
      fetchProgressUpdates();
    }
  }, [isOpen, job._id]);

  const fetchProgressUpdates = async () => {
    try {
      setLoading(true);
      // For now, we'll create mock progress updates
      // In a real app, this would fetch from an API
      const mockUpdates: ProgressUpdate[] = [
        {
          _id: '1',
          jobId: job._id,
          providerId: bid.bidderId,
          providerName: bid.bidderInfo?.name || 'Service Provider',
          type: 'status_update',
          title: 'Work Started',
          content: 'I have started working on your project. I will begin with the initial assessment and preparation.',
          status: 'in_progress',
          createdAt: new Date().toISOString(),
          isRead: true
        },
        {
          _id: '2',
          jobId: job._id,
          providerId: bid.bidderId,
          providerName: bid.bidderInfo?.name || 'Service Provider',
          type: 'message',
          title: 'Progress Update',
          content: 'I have completed the initial assessment. The work is progressing well and I expect to finish on schedule.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: true
        },
        {
          _id: '3',
          jobId: job._id,
          providerId: bid.bidderId,
          providerName: bid.bidderInfo?.name || 'Service Provider',
          type: 'photo',
          title: 'Work Photos',
          content: 'Here are some photos of the work in progress. You can see the quality and attention to detail.',
          files: ['work-photo-1.jpg', 'work-photo-2.jpg'],
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isRead: false
        },
        {
          _id: '4',
          jobId: job._id,
          providerId: bid.bidderId,
          providerName: bid.bidderInfo?.name || 'Service Provider',
          type: 'milestone',
          title: 'Milestone Completed',
          content: 'First phase of the work has been completed successfully. Moving on to the next phase.',
          status: 'milestone_completed',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          isRead: false
        }
      ];
      setProgressUpdates(mockUpdates);
    } catch (err) {
      setError('Failed to fetch progress updates');
      console.error('Error fetching progress updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      // In a real app, this would send a message via API
      const newUpdate: ProgressUpdate = {
        _id: Date.now().toString(),
        jobId: job._id,
        providerId: 'poster', // Indicates this is from the job poster
        providerName: job.posterInfo?.name || 'You',
        type: 'message',
        title: 'Message to Service Provider',
        content: newMessage,
        createdAt: new Date().toISOString(),
        isRead: true
      };
      
      setProgressUpdates(prev => [newUpdate, ...prev]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'status_update': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'file_upload': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'photo': return <Image className="w-5 h-5 text-orange-600" />;
      case 'milestone': return <Star className="w-5 h-5 text-yellow-600" />;
      default: return <Briefcase className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'status_update': return 'bg-blue-50 border-blue-200';
      case 'message': return 'bg-green-50 border-green-200';
      case 'file_upload': return 'bg-purple-50 border-purple-200';
      case 'photo': return 'bg-orange-50 border-orange-200';
      case 'milestone': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'milestone_completed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Work Progress</h2>
              <p className="text-purple-100 mt-1">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Job Details & Service Provider Info */}
          <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Job Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Details</h3>
              <div className="space-y-3 text-sm">
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
                <p className="text-sm text-gray-700">{job.description}</p>
              </div>
            </div>

            {/* Service Provider Info */}
            <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provider</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{bid.bidderInfo?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{bid.bidderInfo?.email}</span>
                </div>
                {bid.bidderInfo?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{bid.bidderInfo.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Bid: ${bid.amount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Timeline: {bid.timeline}</span>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                  {job.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel - Progress Updates */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Progress Updates</h3>
              <div className="text-sm text-gray-500">
                {progressUpdates.filter(update => !update.isRead).length} unread
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {progressUpdates.map((update) => (
                  <div
                    key={update._id}
                    className={`p-4 rounded-lg border ${getUpdateColor(update.type)} ${
                      !update.isRead ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getUpdateIcon(update.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {update.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(update.createdAt)}
                            </span>
                            {!update.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{update.content}</p>
                        
                        {/* Files */}
                        {update.files && update.files.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {update.files.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 px-3 py-1 bg-white rounded-lg border border-gray-200"
                                >
                                  {update.type === 'photo' ? (
                                    <Image className="w-4 h-4 text-orange-600" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-purple-600" />
                                  )}
                                  <span className="text-sm text-gray-700">{file}</span>
                                  <button className="text-blue-600 hover:text-blue-800">
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Badge */}
                        {update.status && (
                          <div className="mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                              {update.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <Eye className="w-4 h-4 inline mr-1" />
                            View Details
                          </button>
                          {update.type === 'photo' && (
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              <ThumbsUp className="w-4 h-4 inline mr-1" />
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* No Updates Message */}
                {progressUpdates.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No updates yet</h3>
                    <p className="text-gray-500">Progress updates will appear here as the work progresses.</p>
                  </div>
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Send Message to Service Provider</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingMessage ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
