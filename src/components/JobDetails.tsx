import React from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  AlertCircle,
  Edit,
  Share,
  Eye
} from 'lucide-react';

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

interface JobDetailsProps {
  job: Job;
}

export default function JobDetails({ job }: JobDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Mock additional job details
  const jobDetails = {
    requirements: [
      'Professional painting experience required',
      'Must provide own equipment and supplies',
      'Availability for weekend work preferred',
      'References from previous clients required'
    ],
    timeline: 'Project should be completed within 1-2 weeks',
    specifications: {
      roomSize: '15ft x 12ft',
      ceilingHeight: '10ft',
      wallCondition: 'Good condition, minor nail holes to fill',
      paintType: 'Eggshell finish preferred',
      colors: 'Will discuss color selection with chosen contractor'
    },
    photos: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400'
    ],
    preferredSchedule: 'Weekends or evenings after 5 PM',
    contactPreference: 'Text or email for initial contact',
    views: 127,
    applications: job.bidCount
  };

  return (
    <div className="space-y-6">
      {/* Job Overview Card */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(job.status)}`}>
                  {job.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getUrgencyColor(job.urgency)}`}>
                  {job.urgency.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Share className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{job.budget}</div>
                <div className="text-sm text-gray-500">Budget Range</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{job.location}</div>
                <div className="text-sm text-gray-500">Location</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">Posted Date</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{jobDetails.views}</div>
                <div className="text-sm text-gray-500">Views</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Job Description</h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Project Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Room Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{jobDetails.specifications.roomSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ceiling Height:</span>
                  <span className="font-semibold">{jobDetails.specifications.ceilingHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wall Condition:</span>
                  <span className="font-semibold">{jobDetails.specifications.wallCondition}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Paint Preferences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Finish Type:</span>
                  <span className="font-semibold">{jobDetails.specifications.paintType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colors:</span>
                  <span className="font-semibold">{jobDetails.specifications.colors}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Timeline & Schedule</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-800">Project Timeline</div>
                  <div className="text-blue-700 text-sm">{jobDetails.timeline}</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Preferred Schedule:</strong> {jobDetails.preferredSchedule}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirements */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Requirements</h3>
            <div className="space-y-3">
              {jobDetails.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700 text-sm">{requirement}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-800">Contact Preference</div>
                  <div className="text-yellow-700 text-sm">{jobDetails.contactPreference}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Photos */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Project Photos</h3>
            <div className="grid grid-cols-2 gap-4">
              {jobDetails.photos.map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`Project photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
              + Add More Photos
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Job Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{jobDetails.views}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{jobDetails.applications}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((jobDetails.applications / jobDetails.views) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Application Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}