// Test the header changes: remove database icon and show user name
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testHeaderChanges() {
  console.log('🧪 Testing Header Changes...\n');

  try {
    // Test 1: Register a test user
    console.log('1️⃣ Registering a test user...');
    const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'header-test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'homeowner'
      })
    });

    const registerData = await registerResponse.json();
    if (registerData.success) {
      console.log('✅ User registered successfully');
      console.log(`   Name: ${registerData.data.user.firstName} ${registerData.data.user.lastName}`);
      console.log(`   Email: ${registerData.data.user.email}`);
      console.log(`   Type: ${registerData.data.user.userType}`);
    } else {
      console.log('❌ User registration failed:', registerData.error);
      return;
    }

    // Test 2: Login the user
    console.log('\n2️⃣ Logging in the user...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'header-test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ User login successful');
      console.log(`   Name: ${loginData.data.user.firstName} ${loginData.data.user.lastName}`);
      console.log(`   Token: ${loginData.data.token.substring(0, 20)}...`);
      
      // Test 3: Verify user data structure
      console.log('\n3️⃣ Verifying user data structure...');
      const user = loginData.data.user;
      if (user.firstName && user.lastName && user.email && user.userType) {
        console.log('✅ User data structure is correct');
        console.log(`   First Name: ${user.firstName}`);
        console.log(`   Last Name: ${user.lastName}`);
        console.log(`   Full Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   User Type: ${user.userType}`);
      } else {
        console.log('❌ User data structure is incomplete');
      }
    } else {
      console.log('❌ User login failed:', loginData.error);
    }

    console.log('\n🎉 Header changes test completed!');
    console.log('\n📝 Expected frontend behavior:');
    console.log('   - Database icon should be removed from navigation');
    console.log('   - When logged in, header should show: "Welcome, John Doe!"');
    console.log('   - User data should be stored in localStorage');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testHeaderChanges();
