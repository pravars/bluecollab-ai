// Test frontend error handling by simulating API calls
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

// Simulate the frontend API service error handling
async function simulateApiServiceRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Return the error response from the backend instead of throwing
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
        message: data.message
      };
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function testFrontendErrorHandling() {
  console.log('🧪 Testing Frontend Error Handling...\n');

  try {
    // Test 1: Wrong password login (should show user-friendly message)
    console.log('1️⃣ Testing wrong password login...');
    const loginResponse = await simulateApiServiceRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    console.log('Login response:', loginResponse);
    
    if (!loginResponse.success) {
      console.log('✅ Error properly handled');
      console.log(`   Error message: ${loginResponse.error}`);
      
      // Test user-friendly message transformation
      const userFriendlyMessage = loginResponse.error === 'Invalid email or password' 
        ? 'Invalid email or password. Please check your credentials and try again.'
        : loginResponse.error || 'Login failed. Please try again.';
      console.log(`   User-friendly message: ${userFriendlyMessage}`);
    } else {
      console.log('❌ Expected error but got success');
    }

    // Test 2: Registration with existing email
    console.log('\n2️⃣ Testing registration with existing email...');
    const registerResponse = await simulateApiServiceRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com', // This email already exists
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        userType: 'homeowner'
      })
    });

    console.log('Register response:', registerResponse);
    
    if (!registerResponse.success) {
      console.log('✅ Error properly handled');
      console.log(`   Error message: ${registerResponse.error}`);
      
      // Test user-friendly message transformation
      const userFriendlyMessage = registerResponse.error === 'User with this email already exists'
        ? 'An account with this email already exists. Please try logging in instead.'
        : registerResponse.error || 'Registration failed. Please try again.';
      console.log(`   User-friendly message: ${userFriendlyMessage}`);
    } else {
      console.log('❌ Expected error but got success');
    }

    // Test 3: Missing required fields
    console.log('\n3️⃣ Testing missing required fields...');
    const missingFieldsResponse = await simulateApiServiceRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com'
        // Missing password, firstName, lastName
      })
    });

    console.log('Missing fields response:', missingFieldsResponse);
    
    if (!missingFieldsResponse.success) {
      console.log('✅ Error properly handled');
      console.log(`   Error message: ${missingFieldsResponse.error}`);
    } else {
      console.log('❌ Expected error but got success');
    }

    console.log('\n🎉 Frontend error handling test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testFrontendErrorHandling();
