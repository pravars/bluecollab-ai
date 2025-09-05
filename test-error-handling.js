// Test error handling in the frontend API service
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testErrorHandling() {
  console.log('🧪 Testing Error Handling...\n');

  try {
    // Test 1: Wrong password login
    console.log('1️⃣ Testing wrong password login...');
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.log('✅ 401 error properly returned');
      console.log(`   Error message: ${data.error}`);
    } else {
      console.log('❌ Expected 401 error but got success');
    }

    // Test 2: Non-existent user
    console.log('\n2️⃣ Testing non-existent user login...');
    const response2 = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
    });

    const data2 = await response2.json();
    console.log('Response status:', response2.status);
    console.log('Response data:', data2);
    
    if (!response2.ok) {
      console.log('✅ 401 error properly returned for non-existent user');
      console.log(`   Error message: ${data2.error}`);
    } else {
      console.log('❌ Expected 401 error but got success');
    }

    // Test 3: Missing fields
    console.log('\n3️⃣ Testing missing fields...');
    const response3 = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com'
        // Missing password
      })
    });

    const data3 = await response3.json();
    console.log('Response status:', response3.status);
    console.log('Response data:', data3);
    
    if (!response3.ok) {
      console.log('✅ 400 error properly returned for missing fields');
      console.log(`   Error message: ${data3.error}`);
    } else {
      console.log('❌ Expected 400 error but got success');
    }

    console.log('\n🎉 Error handling test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testErrorHandling();
