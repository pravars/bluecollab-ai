// Test authentication flow end-to-end
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'auth-test@example.com',
        password: 'testpassword123',
        firstName: 'Auth',
        lastName: 'Test',
        userType: 'homeowner'
      })
    });

    const registerData = await registerResponse.json();
    if (registerData.success) {
      console.log('✅ Registration successful');
      console.log(`   User ID: ${registerData.data.user._id}`);
      console.log(`   Token: ${registerData.data.token.substring(0, 20)}...`);
    } else {
      console.log('❌ Registration failed:', registerData.error);
      return;
    }

    // Test 2: Login with correct password
    console.log('\n2️⃣ Testing login with correct password...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'auth-test@example.com',
        password: 'testpassword123'
      })
    });

    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Login successful');
      console.log(`   User: ${loginData.data.user.firstName} ${loginData.data.user.lastName}`);
    } else {
      console.log('❌ Login failed:', loginData.error);
    }

    // Test 3: Login with wrong password
    console.log('\n3️⃣ Testing login with wrong password...');
    const wrongLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'auth-test@example.com',
        password: 'wrongpassword'
      })
    });

    const wrongLoginData = await wrongLoginResponse.json();
    if (!wrongLoginData.success) {
      console.log('✅ Wrong password correctly rejected');
      console.log(`   Error: ${wrongLoginData.error}`);
    } else {
      console.log('❌ Wrong password was accepted (security issue!)');
    }

    // Test 4: Check if user appears in database
    console.log('\n4️⃣ Checking if user appears in database...');
    const usersResponse = await fetch(`${API_BASE}/api/users`);
    const usersData = await usersResponse.json();
    
    if (usersData.success) {
      const testUser = usersData.data.find(user => user.email === 'auth-test@example.com');
      if (testUser) {
        console.log('✅ User found in database');
        console.log(`   Name: ${testUser.firstName} ${testUser.lastName}`);
        console.log(`   Type: ${testUser.userType}`);
        console.log(`   Created: ${testUser.createdAt}`);
      } else {
        console.log('❌ User not found in database');
      }
    } else {
      console.log('❌ Failed to fetch users:', usersData.error);
    }

    console.log('\n🎉 Authentication flow test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testAuthFlow();
