import React from 'react';
import { MessageCircle } from 'lucide-react';

export function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="text-lg font-semibold text-gray-700">Loading ServiceAI...</div>
      </div>
    </div>
  );
}