// Debug script for Material Estimation System
import dotenv from 'dotenv';
import { MaterialExtractionRequest } from './backend/src/models/MaterialEstimate.js';
import GeminiService from './backend/src/services/GeminiService.js';

// Load environment variables
dotenv.config();

async function debugMaterialEstimation() {
  console.log('🔍 Debugging Material Estimation System...\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Environment Variables:');
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('GEMINI_MODEL:', process.env.GEMINI_MODEL || 'Not set');
    console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set');

    // Test 2: Test Gemini Service
    console.log('\n2️⃣ Testing Gemini Service...');
    const geminiService = new GeminiService();
    
    const request = new MaterialExtractionRequest({
      jobDescription: 'Fix leaky faucet',
      serviceType: 'plumbing',
      location: 'Kitchen',
      urgency: 'high',
      budget: 500
    });

    console.log('Request created:', request);
    
    // Test Gemini API call
    console.log('\n3️⃣ Testing Gemini API call...');
    const result = await geminiService.extractMaterials(request);
    console.log('✅ Gemini API result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('❌ Debug error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugMaterialEstimation();
