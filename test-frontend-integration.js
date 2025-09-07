// Test frontend integration with material estimation API
import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

async function testFrontendIntegration() {
  console.log('🧪 Testing Frontend Integration...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣ Checking backend health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend health:', healthResponse.data.status);

    // Test 2: Check material estimation service health
    console.log('\n2️⃣ Checking material estimation service...');
    const materialHealthResponse = await axios.get(`${BASE_URL}/api/material-estimation/health`);
    console.log('✅ Material estimation health:', materialHealthResponse.data.status);

    // Test 3: Test material estimation API
    console.log('\n3️⃣ Testing material estimation API...');
    const estimateResponse = await axios.post(`${BASE_URL}/api/material-estimation/estimate`, {
      jobId: 'frontend-test-123',
      jobDescription: 'Install new kitchen faucet and fix leaky pipes under the sink',
      serviceType: 'plumbing',
      location: 'Kitchen',
      urgency: 'high',
      budget: 400
    });

    if (estimateResponse.data.success) {
      console.log('✅ Material estimate generated successfully!');
      console.log(`📊 Found ${estimateResponse.data.data.extractedMaterials.length} materials`);
      console.log(`💰 Estimated cost: $${estimateResponse.data.data.totalEstimatedCost}`);
      console.log(`🎯 Confidence: ${estimateResponse.data.data.confidence}%`);
      console.log(`⏱️ Processing time: ${estimateResponse.data.data.processingTime}ms`);
    } else {
      console.log('❌ Failed to generate estimate:', estimateResponse.data.error);
    }

    // Test 4: Test retrieving the estimate
    console.log('\n4️⃣ Testing estimate retrieval...');
    const getEstimateResponse = await axios.get(`${BASE_URL}/api/material-estimation/estimate/frontend-test-123`);
    
    if (getEstimateResponse.data.success) {
      console.log('✅ Estimate retrieved successfully!');
      console.log(`📋 Materials: ${getEstimateResponse.data.data.extractedMaterials.length} items`);
    } else {
      console.log('❌ Failed to retrieve estimate:', getEstimateResponse.data.error);
    }

    console.log('\n🎉 Frontend integration test completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the frontend: npm run dev');
    console.log('2. Navigate to job posting form');
    console.log('3. Fill in job description and service type');
    console.log('4. Click "Generate AI Material Estimate" button');
    console.log('5. View the AI-generated material breakdown');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFrontendIntegration();