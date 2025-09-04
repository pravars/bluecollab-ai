import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Camera, 
  MessageSquare, 
  Star,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Truck,
  Paintbrush,
  ClipboardCheck
} from 'lucide-react';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  estimatedDate?: string;
  icon: React.ComponentType<any>;
  photos?: string[];
  notes?: string;
}

interface JobProgressProps {
  jobId: string;
}

export default function JobProgress({ jobId }: JobProgressProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  // Mock contractor info (accepted bid)
  const contractor = {
    name: 'Mike\'s Professional Painting',
    rating: 4.9,
    phone: '(555) 123-4567',
    email: 'mike@mikespainting.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  };

  // Mock timeline data
  const [timeline] = useState<TimelineStep[]>([
    {
      id: '1',
      title: 'Job Accepted',
      description: 'Contractor accepted the job and contract signed',
      status: 'completed',
      date: '2025-01-16T15:30:00',
      icon: CheckCircle,
      notes: 'Contract signed electronically. Work scheduled to begin on January 18th.'
    },
    {
      id: '2',
      title: 'Materials Ordered',
      description: 'All required materials have been ordered from Home Depot',
      status: 'completed',
      date: '2025-01-17T09:15:00',
      icon: Truck,
      notes: 'Order #HD-789123: Benjamin Moore paint, primer, brushes, and supplies. Estimated delivery: January 18th morning.'
    },
    {
      id: '3',
      title: 'Site Preparation',
      description: 'Room prep work including furniture moving and surface cleaning',
      status: 'current',
      estimatedDate: '2025-01-18T08:00:00',
      icon: ClipboardCheck,
      photos: [
        'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400',
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400'
      ],
      notes: 'Started at 8:00 AM. Furniture moved to center, walls cleaned, holes filled with spackle.'
    },
    {
      id: '4',
      title: 'Primer Application',
      description: 'Applying primer coat to ensure proper paint adhesion',
      status: 'upcoming',
      estimatedDate: '2025-01-18T12:00:00',
      icon: Paintbrush
    },
    {
      id: '5',
      title: 'First Paint Coat',
      description: 'Application of the first coat of chosen paint color',
      status: 'upcoming',
      estimatedDate: '2025-01-19T09:00:00',
      icon: Paintbrush
    },
    {
      id: '6',
      title: 'Second Paint Coat',
      description: 'Final coat application for complete coverage',
      status: 'upcoming',
      estimatedDate: '2025-01-19T14:00:00',
      icon: Paintbrush
    },
    {
      id: '7',
      title: 'Cleanup & Inspection',
      description: 'Final cleanup, furniture replacement, and quality inspection',
      status: 'upcoming',
      estimatedDate: '2025-01-20T10:00:00',
      icon: CheckCircle
    }
  ]);

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 border-green-600';
      case 'current': return 'bg-blue-600 border-blue-600 animate-pulse';
      case 'upcoming': return 'bg-gray-300 border-gray-300';
      default: return 'bg-gray-300 border-gray-300';
    }
  };

  const getStepTextColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-800';
      case 'current': return 'text-blue-800';
      case 'upcoming': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const currentStep = timeline.find(step => step.status === 'current');
  const completedSteps = timeline.filter(step => step.status === 'completed').length;
  const totalSteps = timeline.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Job Progress</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completedSteps}/{totalSteps}</div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status */}
          {currentStep && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <currentStep.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Currently: {currentStep.title}</h3>
                  <p className="text-blue-700 text-sm">{currentStep.description}</p>
                  {currentStep.estimatedDate && (
                    <div className="flex items-center space-x-1 text-blue-600 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span>Started: {new Date(currentStep.estimatedDate).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contractor Info */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Assigned Contractor</h3>
          <div className="flex items-center space-x-4">
            <img
              src={contractor.avatar}
              alt={contractor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{contractor.name}</h4>
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{contractor.rating} rating</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{contractor.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{contractor.email}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Progress Timeline</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {timeline.map((step, index) => (
                <div key={step.id} className="relative flex items-start space-x-4">
                  {/* Timeline Dot */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${getStepColor(step.status)}`}>
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold ${getStepTextColor(step.status)}`}>
                          {step.title}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {step.date ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{new Date(step.date).toLocaleString()}</span>
                            </div>
                          ) : step.estimatedDate ? (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span>Est: {new Date(step.estimatedDate).toLocaleString()}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${getStepTextColor(step.status)}`}>
                        {step.description}
                      </p>
                      
                      {step.notes && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-semibold text-sm text-gray-800">Notes</div>
                              <div className="text-sm text-gray-600">{step.notes}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {step.photos && step.photos.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Camera className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">Progress Photos</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {step.photos.map((photo, photoIndex) => (
                              <img
                                key={photoIndex}
                                src={photo}
                                alt={`Progress photo ${photoIndex + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedPhoto(photo)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Completion */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Project Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-800">Start Date</div>
              <div className="text-sm text-blue-700">January 18, 2025</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-green-800">Est. Completion</div>
              <div className="text-sm text-green-700">January 20, 2025</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-800">Duration</div>
              <div className="text-sm text-purple-700">3 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedPhoto}
              alt="Progress photo"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}