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
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import apiService from '../services/api';
import { WorkProgressUpdate, WorkProgressMessage, CreateMessageRequest } from '../models/WorkProgress';

interface JobProgressViewProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  bid: any;
  currentUserId: string;
}

const JobProgressView: React.FC<JobProgressViewProps> = ({
  isOpen,
  onClose,
  job,
  bid,
  currentUserId
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'conversation'>('progress');
  const [progressUpdates, setProgressUpdates] = useState<WorkProgressUpdate[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

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
      const response = await apiService.getJobProgress(job._id);
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

  // Filter progress updates based on internal notes visibility
  const visibleUpdates = progressUpdates.filter(update => 
    !update.isInternal || showInternalNotes
  );

  // Calculate overall progress
  const overallProgress = progressUpdates.length > 0 
    ? Math.round(progressUpdates.reduce((sum, update) => sum + update.progress, 0) / progressUpdates.length)
    : 0;

  // Get latest status
  const latestStatus = progressUpdates.length > 0 ? progressUpdates[0].status : 'pending';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Job Progress</h2>
            <p className="text-sm text-gray-600">{job?.title}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(latestStatus)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(latestStatus)}`}>
                  {latestStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{overallProgress}%</span>
              </div>
            </div>
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
              {/* Progress Summary */}
              <div className="p-6 border-b bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{overallProgress}%</div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{progressUpdates.length}</div>
                    <div className="text-sm text-gray-600">Total Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {progressUpdates.filter(u => u.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed Tasks</div>
                  </div>
                </div>
                
                {/* Internal Notes Toggle */}
                <div className="mt-4 flex items-center justify-center">
                  <button
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showInternalNotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>
                      {showInternalNotes ? 'Hide' : 'Show'} Internal Notes
                    </span>
                  </button>
                </div>
              </div>

              {/* Progress Updates List */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress History</h3>
                {loading && progressUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading progress updates...</p>
                  </div>
                ) : visibleUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No progress updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleUpdates.map((update) => (
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Conversation with Service Provider</h3>
                  {job.status === 'completed' && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Job Completed</span>
                    </div>
                  )}
                </div>
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
                        className={`flex ${message.senderType === 'homeowner' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderType === 'homeowner'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderType === 'homeowner' ? 'text-blue-100' : 'text-gray-500'
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

export default JobProgressView;