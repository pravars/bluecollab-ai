import React, { useState } from 'react';
import apiService from '../services/api';

interface AIMaterialEstimatorProps {
  jobId: string;
  jobDescription: string;
  serviceType: string;
  location?: string;
  urgency?: string;
  budget?: number;
  onEstimateGenerated: (estimate: {
    extractedMaterials: Array<{
      category: string;
      name: string;
      quantity: number;
      unit: string;
      specifications: string[];
      estimatedSize: string;
      quality: string;
      notes: string;
    }>;
    totalEstimatedCost: number;
    confidence: number;
  }) => void;
}

const AIMaterialEstimator: React.FC<AIMaterialEstimatorProps> = ({
  jobId,
  jobDescription,
  serviceType,
  location,
  urgency,
  budget,
  onEstimateGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEstimate, setLastEstimate] = useState<any>(null);

  const handleGenerateEstimate = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('🤖 Generating AI material estimate...');
      const response = await apiService.generateMaterialEstimate({
        jobId,
        jobDescription,
        serviceType,
        location,
        urgency,
        budget
      });

      if (response.success && response.data) {
        console.log('✅ AI estimate generated:', response.data);
        setLastEstimate(response.data);
        onEstimateGenerated({
          extractedMaterials: response.data.extractedMaterials,
          totalEstimatedCost: response.data.totalEstimatedCost,
          confidence: response.data.confidence
        });
      } else {
        setError(response.error || 'Failed to generate material estimate');
      }
    } catch (error) {
      console.error('❌ Error generating estimate:', error);
      setError('Failed to connect to AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-blue-900">AI Material Estimator</h3>
        </div>
        <div className="text-sm text-blue-700">
          Powered by Gemini 1.5
        </div>
      </div>

      <p className="text-sm text-blue-800 mb-4">
        Get an AI-powered material breakdown for your job. This will help service providers create more accurate bids.
      </p>

      <button
        onClick={handleGenerateEstimate}
        disabled={isGenerating || !jobDescription.trim()}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isGenerating || !jobDescription.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Estimate...</span>
          </div>
        ) : (
          'Generate AI Material Estimate'
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {lastEstimate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-900">AI Estimate Generated</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-700">
                Confidence: {lastEstimate.confidence}%
              </span>
              <span className="text-sm text-green-600">
                ${lastEstimate.totalEstimatedCost.toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-sm text-green-800">
            Found {lastEstimate.extractedMaterials.length} materials in {lastEstimate.processingTime}ms
          </p>
        </div>
      )}
    </div>
  );
};

export default AIMaterialEstimator;
