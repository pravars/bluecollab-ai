// Test script for User Service
const http = require('http');

// Test data
const testUser = {
  email: 'test@bluecollab.ai',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  userType: 'homeowner',
  phone: '+1234567890',
  profile: {
    bio: 'Test user for Dwello platform',
    specialties: ['home_repair'],
    emergencyAvailable: true
  },
  addresses: [{
    addressType: 'home',
    streetAddress: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    postalCode: '12345',
    country: 'USA',
    isPrimary: true
  }]
};

// Test functions
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testUserService() {
  console.log('🧪 Testing User Service...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/health',
      method: 'GET'
    });
    console.log('✅ Health Check:', healthResponse.status, healthResponse.data);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const registerResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/users/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, testUser);
    console.log('✅ User Registration:', registerResponse.status, registerResponse.data);
    console.log('');

    // Test 3: User Login
    console.log('3. Testing User Login...');
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'test@bluecollab.ai',
      password: 'password123'
    });
    console.log('✅ User Login:', loginResponse.status, loginResponse.data);
    console.log('');

    // Test 4: Get Users (if we have a token)
    if (loginResponse.data && loginResponse.data.data && loginResponse.data.data.token) {
      console.log('4. Testing Get Users...');
      const usersResponse = await makeRequest({
        hostname: 'localhost',
        port: 3002,
        path: '/api/v1/users',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResponse.data.data.token}`
        }
      });
      console.log('✅ Get Users:', usersResponse.status, usersResponse.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testUserService();
