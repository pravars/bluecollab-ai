// Test script for Material Estimation System
import axios from 'axios';

const BASE_URL = 'http://localhost:3002';

async function testMaterialEstimation() {
  console.log('🧪 Testing Material Estimation System...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/material-estimation/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Initialize templates
    console.log('\n2️⃣ Initializing material templates...');
    const templateResponse = await axios.post(`${BASE_URL}/api/material-estimation/templates/init`);
    console.log('✅ Templates initialized:', templateResponse.data);

    // Test 3: Generate material estimate
    console.log('\n3️⃣ Generating material estimate...');
    const estimateRequest = {
      jobId: 'test-job-123',
      jobDescription: 'Need to fix a leaky kitchen faucet and replace the old pipes under the sink. The faucet is dripping constantly and the pipes are corroded. Also need to install a new garbage disposal.',
      serviceType: 'plumbing',
      location: 'Kitchen',
      urgency: 'high',
      budget: 500
    };

    const estimateResponse = await axios.post(`${BASE_URL}/api/material-estimation/estimate`, estimateRequest);
    console.log('✅ Material estimate generated:');
    console.log(JSON.stringify(estimateResponse.data, null, 2));

    // Test 4: Retrieve the estimate
    console.log('\n4️⃣ Retrieving material estimate...');
    const getEstimateResponse = await axios.get(`${BASE_URL}/api/material-estimation/estimate/test-job-123`);
    console.log('✅ Retrieved estimate:');
    console.log(JSON.stringify(getEstimateResponse.data, null, 2));

    // Test 5: Test with different service type
    console.log('\n5️⃣ Testing with electrical service...');
    const electricalRequest = {
      jobId: 'test-job-456',
      jobDescription: 'Need to install new electrical outlets in the living room and replace the old light switches. Also need to add a ceiling fan.',
      serviceType: 'electrical',
      location: 'Living Room',
      urgency: 'medium',
      budget: 300
    };

    const electricalResponse = await axios.post(`${BASE_URL}/api/material-estimation/estimate`, electricalRequest);
    console.log('✅ Electrical estimate generated:');
    console.log(JSON.stringify(electricalResponse.data, null, 2));

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testMaterialEstimation();
