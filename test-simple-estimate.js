// Simple test for material estimation
import axios from 'axios';

async function testSimpleEstimate() {
  try {
    console.log('🧪 Testing Simple Material Estimation...\n');
    
    const response = await axios.post('http://localhost:3002/api/material-estimation/estimate', {
      jobId: 'simple-test-123',
      jobDescription: 'Fix leaky faucet',
      serviceType: 'plumbing'
    });
    
    console.log('✅ Success!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSimpleEstimate();
