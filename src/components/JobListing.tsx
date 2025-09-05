import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Job } from '../models/Job';

interface JobListingProps {
  onJobSelect: (job: Job) => void;
}

const JobListing: React.FC<JobListingProps> = ({ onJobSelect }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    serviceType: '',
    status: 'open'
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('JobListing: Fetching jobs with filters:', filters);
      const response = await apiService.getJobs(filters);
      console.log('JobListing: API response:', response);
      if (response.success) {
        setJobs(response.data || []);
        console.log('JobListing: Jobs set to:', response.data || []);
      } else {
        setError(response.error || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Service Types</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC</option>
              <option value="Painting">Painting</option>
              <option value="Flooring">Flooring</option>
              <option value="Roofing">Roofing</option>
              <option value="Handyman">Handyman</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Renovation">Renovation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onJobSelect(job)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Service Type:</span>
                    <p className="text-gray-900">{job.serviceType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <p className="text-gray-900">{job.budget}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Timeline:</span>
                    <p className="text-gray-900">{job.timeline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <p className="text-gray-900">{job.estimatedDuration}</p>
                  </div>
                </div>

                {/* Skills and Requirements */}
                {(job.skillsRequired?.length > 0 || job.specialRequirements?.length > 0) && (
                  <div className="mb-4">
                    {job.skillsRequired?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500">Skills Required:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.skillsRequired.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.specialRequirements?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Special Requirements:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.specialRequirements.map((req, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Posted by {job.posterInfo?.name} • {formatDate(job.createdAt)}
                  </div>
                  <div className="flex items-center space-x-4">
                    {job.bidCount > 0 && (
                      <span className="text-sm text-gray-500">
                        {job.bidCount} bid{job.bidCount !== 1 ? 's' : ''}
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobListing;
