import React, { useState } from 'react';
import apiService from '../services/api';
import { CreateJobRequest, JobPhoto } from '../models/Job';
import PhotoUpload from './PhotoUpload';
import AIMaterialEstimator from './AIMaterialEstimator';

interface JobPostingFormProps {
  userId: string;
  onJobPosted: (job: any) => void;
  onCancel: () => void;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ userId, onJobPosted, onCancel }) => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    title: '',
    description: '',
    serviceType: '',
    scope: '',
    timeline: '',
    budget: '',
    location: '',
    urgency: 'medium',
    specialRequirements: [],
    estimatedDuration: '',
    skillsRequired: []
  });

  const [specialReqInput, setSpecialReqInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [aiMaterialEstimate, setAiMaterialEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    'Plumbing', 'Electrical', 'HVAC', 'Painting', 'Flooring', 'Roofing',
    'Handyman', 'Cleaning', 'Landscaping', 'Renovation', 'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low (Flexible timing)' },
    { value: 'medium', label: 'Medium (Within a week)' },
    { value: 'high', label: 'High (ASAP/Urgent)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSpecialRequirement = () => {
    if (specialReqInput.trim()) {
      setFormData(prev => ({
        ...prev,
        specialRequirements: [...prev.specialRequirements, specialReqInput.trim()]
      }));
      setSpecialReqInput('');
    }
  };

  const handleRemoveSpecialRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    if (skillsInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillsInput.trim()]
      }));
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jobData = {
        ...formData,
        postedBy: userId,
        photos: photos
      };
      console.log('Creating job with data:', jobData);
      console.log('JobPostingForm userId prop:', userId);
      const response = await apiService.createJob(jobData);
      console.log('Job creation response:', response);

      if (response.success) {
        onJobPosted(response.data);
      } else {
        setError(response.error || 'Failed to post job');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error posting job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Fix leaky kitchen faucet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select service type</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the job in detail..."
          />
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scope of Work
            </label>
            <input
              type="text"
              name="scope"
              value={formData.scope}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Replace faucet and check pipes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Duration
            </label>
            <input
              type="text"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2-3 hours"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline
            </label>
            <input
              type="text"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., This weekend"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., $100-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 123 Main St, City, State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {urgencyLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={specialReqInput}
              onChange={(e) => setSpecialReqInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a special requirement..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialRequirement())}
            />
            <button
              type="button"
              onClick={handleAddSpecialRequirement}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.specialRequirements.map((req, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {req}
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialRequirement(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Skills Required */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a required skill..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={10}
          />
        </div>

        {/* AI Material Estimator */}
        {formData.description && formData.serviceType && (
          <div>
            <AIMaterialEstimator
              jobId={`temp-${Date.now()}`}
              jobDescription={formData.description}
              serviceType={formData.serviceType}
              location={formData.location}
              urgency={formData.urgency}
              budget={formData.budget ? parseFloat(formData.budget) : undefined}
              onEstimateGenerated={(estimate) => {
                setAiMaterialEstimate(estimate);
                console.log('AI Material Estimate:', estimate);
              }}
            />
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting Job...' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;
