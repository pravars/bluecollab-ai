import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  XCircle,
  MessageSquare,
  Paperclip,
  Send,
  Calendar,
  User
} from 'lucide-react';
import apiService from '../services/api';
import { WorkProgressUpdate, WorkProgressMessage, CreateProgressUpdateRequest, CreateMessageRequest } from '../models/WorkProgress';

interface WorkProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  bid: any;
  currentUserId: string;
  userType: 'homeowner' | 'service_provider';
}

const WorkProgressModal: React.FC<WorkProgressModalProps> = ({
  isOpen,
  onClose,
  job,
  bid,
  currentUserId,
  userType
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'conversation'>('progress');
  const [progressUpdates, setProgressUpdates] = useState<WorkProgressUpdate[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Progress form state
  const [progressForm, setProgressForm] = useState({
    status: 'in_progress' as WorkProgressUpdate['status'],
    progress: 0,
    title: '',
    description: '',
    isInternal: false
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    content: '',
    attachments: [] as string[]
  });

  useEffect(() => {
    if (isOpen && job?._id && bid?._id) {
      fetchProgressUpdates();
      fetchConversation();
    }
  }, [isOpen, job?._id, bid?._id]);

  const fetchProgressUpdates = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBidProgress(bid._id);
      if (response.success) {
        setProgressUpdates(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch progress updates');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching progress updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async () => {
    try {
      const response = await apiService.getConversation(job._id, bid._id);
      if (response.success) {
        setConversation(response.data);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData: CreateProgressUpdateRequest = {
        jobId: job._id,
        bidId: bid._id,
        ...progressForm
      };

      const response = await apiService.createProgressUpdate(updateData);
      if (response.success) {
        setProgressUpdates(prev => [response.data, ...prev]);
        setProgressForm({
          status: 'in_progress',
          progress: progressForm.progress,
          title: '',
          description: '',
          isInternal: false
        });
      } else {
        setError(response.error || 'Failed to create progress update');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error creating progress update:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.content.trim()) return;

    try {
      setLoading(true);
      const messageData: CreateMessageRequest = {
        jobId: job._id,
        bidId: bid._id,
        content: messageForm.content,
        attachments: messageForm.attachments
      };

      const response = await apiService.sendMessage(messageData);
      if (response.success) {
        setMessageForm({ content: '', attachments: [] });
        fetchConversation(); // Refresh conversation
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: WorkProgressUpdate['status']) => {
    switch (status) {
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'on_hold':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'needs_attention':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: WorkProgressUpdate['status']) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'needs_attention':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Work Progress</h2>
            <p className="text-sm text-gray-600">{job?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Progress Updates
          </button>
          <button
            onClick={() => setActiveTab('conversation')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'conversation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Conversation
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'progress' && (
            <div className="h-full flex flex-col">
              {/* Progress Form (Service Provider Only) */}
              {userType === 'service_provider' && (
                <div className="p-6 border-b bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Progress Update</h3>
                  <form onSubmit={handleProgressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={progressForm.status}
                          onChange={(e) => setProgressForm(prev => ({ ...prev, status: e.target.value as WorkProgressUpdate['status'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="in_progress">In Progress</option>
                          <option value="on_hold">On Hold</option>
                          <option value="completed">Completed</option>
                          <option value="needs_attention">Needs Attention</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Progress: {progressForm.progress}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressForm.progress}
                          onChange={(e) => setProgressForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={progressForm.title}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief title for this update"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={progressForm.description}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description of the work progress"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isInternal"
                        checked={progressForm.isInternal}
                        onChange={(e) => setProgressForm(prev => ({ ...prev, isInternal: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isInternal" className="ml-2 text-sm text-gray-700">
                        Internal note (not visible to homeowner)
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Adding Update...' : 'Add Progress Update'}
                    </button>
                  </form>
                </div>
              )}

              {/* Progress Updates List */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress History</h3>
                {loading && progressUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading progress updates...</p>
                  </div>
                ) : progressUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No progress updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {progressUpdates.map((update) => (
                      <div key={update._id} className={`border rounded-lg p-4 ${update.isInternal ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(update.status)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{update.title}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(update.status)}`}>
                                  {update.status.replace('_', ' ')}
                                </span>
                                {update.isInternal && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                    Internal
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {update.updatedByName}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(update.timestamp).toLocaleString()}
                                </span>
                                <span>Progress: {update.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {update.attachments && update.attachments.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600">Attachments:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {update.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <Paperclip className="w-3 h-3 inline mr-1" />
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'conversation' && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation</h3>
                {conversation?.messages?.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversation?.messages?.map((message: WorkProgressMessage) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderType === userType ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderType === userType
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderType === userType ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.senderName} • {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Form */}
              <div className="border-t p-4 bg-gray-50">
                <form onSubmit={handleMessageSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={messageForm.content}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !messageForm.content.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkProgressModal;